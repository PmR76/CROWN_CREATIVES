#!/usr/bin/env node

/**
 * Crown Creatives – Module Scanner v1 (Handshake + Auto-Fix)
 * ----------------------------------------------------------
 * - Recursively scans a folder (HTML, CSS, JS)
 * - Detects viewport blockers & dangerous patterns
 * - Handshake 1: show planned fixes
 * - On approval: creates .bak backups and applies auto-fixes
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ROOT = process.argv[2];

if (!ROOT) {
  console.error('Usage: node cc-scanner.js "C:\\path\\to\\project"');
  process.exit(1);
}

const exts = ['.html', '.htm', '.css', '.js'];

const issues = []; // { file, type, description, fixFn }

/**
 * Utility: walk directory recursively
 */
function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

/**
 * Rule helpers
 */
function addIssue(file, type, description, fixer) {
  issues.push({ file, type, description, fixer });
}

/**
 * Auto-fix helpers
 */
function backupFile(file) {
  const bak = file + '.bak';
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(file, bak);
  }
}

function writeFile(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

/**
 * RULE: HTML – duplicate cc-background wrapper
 * - Remove extra <div id="cc-background"> blocks
 */
function scanHtml(file, content) {
  const lower = content.toLowerCase();
  const marker = 'id="cc-background"';
  const count = (lower.match(new RegExp(marker, 'g')) || []).length;

  if (count > 1) {
    addIssue(
      file,
      'CRITICAL',
      `Duplicate #cc-background detected (${count} instances)`,
      () => {
        // naive but safe-ish: keep first, remove subsequent wrappers
        let firstIndex = lower.indexOf(marker);
        if (firstIndex === -1) return content;

        // find the opening <div ...> that contains this id
        const openStart = lower.lastIndexOf('<div', firstIndex);
        if (openStart === -1) return content;

        // we keep the first one, remove others by pattern
        // remove any subsequent <div id="cc-background">...</div>
        const regex = /<div[^>]*id=["']cc-background["'][\s\S]*?<\/div>/gi;
        let match;
        let seen = 0;
        let result = content;

        while ((match = regex.exec(content)) !== null) {
          if (seen === 0) {
            // keep first
            seen++;
            continue;
          }
          result = result.replace(match[0], `<!-- REMOVED duplicate cc-background by scanner -->`);
          seen++;
        }
        return result;
      }
    );
  }

  // RULE: full-screen fixed overlays
  // Look for obvious overlay divs with inline style
  const overlayRegex = /<div[^>]+style=["'][^"']*(position:\s*fixed)[^"']*(top:\s*0)[^"']*(left:\s*0)[^"']*(width:\s*100%|100vw)[^"']*(height:\s*100%|100vh)[^"']*["'][^>]*>/gi;
  if (overlayRegex.test(content)) {
    addIssue(
      file,
      'CRITICAL',
      'Full-screen fixed overlay div detected (inline style)',
      () => content.replace(overlayRegex, match =>
        `<!-- REMOVED full-screen overlay by scanner -->`
      )
    );
  }

  return content;
}

/**
 * RULE: CSS – full-screen fixed, overflow hidden, huge z-index
 */
function scanCss(file, content) {
  let modified = content;

  // Full-screen fixed blocks
  const fixedBlockRegex = /([^{]+)\{[^}]*position:\s*fixed[^}]*\}/gi;
  let fixedMatch;
  while ((fixedMatch = fixedBlockRegex.exec(content)) !== null) {
    const block = fixedMatch[0];
    const hasFullScreen =
      /top:\s*0/.test(block) &&
      /left:\s*0/.test(block) &&
      (/(width:\s*100%|width:\s*100vw)/.test(block)) &&
      (/(height:\s*100%|height:\s*100vh)/.test(block));

    if (hasFullScreen) {
      addIssue(
        file,
        'CRITICAL',
        `Full-screen fixed CSS block detected for selector: ${fixedMatch[1].trim()}`,
        () => modified.replace(block, `/* REMOVED full-screen fixed block by scanner */`)
      );
    }
  }

  // overflow: hidden on body/html
  const overflowBodyRegex = /(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi;
  if (overflowBodyRegex.test(content)) {
    addIssue(
      file,
      'CRITICAL',
      'overflow:hidden on html/body detected',
      () => modified.replace(overflowBodyRegex, match =>
        match.replace(/overflow:\s*hidden\s*;?/gi, '/* overflow:hidden removed by scanner */')
      )
    );
  }

  // insane z-index
  const zIndexRegex = /z-index:\s*(\d{4,})/gi;
  let zMatch;
  while ((zMatch = zIndexRegex.exec(content)) !== null) {
    const value = parseInt(zMatch[1], 10);
    if (value > 5000) {
      addIssue(
        file,
        'WARNING',
        `Very high z-index (${value}) detected`,
        () => modified.replace(zMatch[0], 'z-index: 500; /* lowered by scanner */')
      );
    }
  }

  return modified;
}

/**
 * RULE: JS – body/html overflow, full-screen style, etc.
 */
function scanJs(file, content) {
  let modified = content;

  // body overflow hidden
  const bodyOverflowRegex = /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/gi;
  if (bodyOverflowRegex.test(content)) {
    addIssue(
      file,
      'CRITICAL',
      'JS sets document.body.style.overflow = "hidden"',
      () => modified.replace(bodyOverflowRegex, '// removed overflow hidden by scanner')
    );
  }

  // html overflow hidden
  const htmlOverflowRegex = /document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/gi;
  if (htmlOverflowRegex.test(content)) {
    addIssue(
      file,
      'CRITICAL',
      'JS sets document.documentElement.style.overflow = "hidden"',
      () => modified.replace(htmlOverflowRegex, '// removed overflow hidden by scanner')
    );
  }

  return modified;
}

/**
 * Main scan
 */
console.log(`🔍 Scanning: ${ROOT}\n`);

const files = walk(ROOT).filter(f => exts.includes(path.extname(f).toLowerCase()));

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  let content = fs.readFileSync(file, 'utf8');
  let modified = content;

  if (ext === '.html' || ext === '.htm') {
    modified = scanHtml(file, content);
  } else if (ext === '.css') {
    modified = scanCss(file, content);
  } else if (ext === '.js') {
    modified = scanJs(file, content);
  }

  // we don't write yet; auto-fix happens after handshake
}

if (issues.length === 0) {
  console.log('✅ No critical issues detected. Project looks clean.\n');
  rl.close();
  process.exit(0);
}

console.log('⚠ Issues detected:\n');
issues.forEach((issue, i) => {
  console.log(
    `${i + 1}. [${issue.type}] ${issue.file}\n   - ${issue.description}\n`
  );
});

rl.question('Proceed with AUTO-FIX on these files? (y/N): ', answer => {
  if (!/^y(es)?$/i.test(answer.trim())) {
    console.log('\n❌ Auto-fix cancelled. No files were changed.');
    rl.close();
    process.exit(0);
  }

  console.log('\n✏ Applying auto-fixes...\n');

  // Group issues by file
  const byFile = new Map();
  for (const issue of issues) {
    if (!byFile.has(issue.file)) byFile.set(issue.file, []);
    byFile.get(issue.file).push(issue);
  }

  for (const [file, fileIssues] of byFile.entries()) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = content;

    for (const issue of fileIssues) {
      try {
        modified = issue.fixer(modified);
      } catch (e) {
        console.warn(`   ⚠ Failed to apply fix for ${issue.file}: ${issue.description}`);
      }
    }

    if (modified !== content) {
      backupFile(file);
      writeFile(file, modified);
      console.log(`   ✅ Fixed: ${file}`);
    } else {
      console.log(`   ➖ No change needed: ${file}`);
    }
  }

  console.log('\n🎉 Done. Backups created as *.bak next to modified files.\n');
  rl.close();
});
