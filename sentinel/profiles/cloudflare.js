// ============================================================
// SENTINEL CLOUDLARE PROFILE MODULE — GR1-STABLE
// Auto-detects Cloudflare Pages behaviour and deployment issues
// ============================================================

export const CloudflareProfile = {
  name: "cloudflare-pages",
  version: "GR1",

  // Cloudflare Pages always builds from GitHub
  source: "github",

  // Expected build command
  expectedBuildCommand: "npm run build",

  // Expected output directory
  expectedOutputDir: "dist",

  // Expected root directory for your project
  expectedRootDir: "test/core-lab-react",

  // SPA rewrite file
  expectedRedirectsFile: "_redirects",

  // Cloudflare 404 signature
  cloudflare404Signature: "<!doctype html>",

  // Auto-detect Cloudflare 404 HTML
  isCloudflare404(html) {
    if (!html) return true;
    return html.trim().startsWith(this.cloudflare404Signature);
  },

  // Diagnose production failures
  diagnose(prod) {
    const issues = [];

    if (prod.status === 404 || prod.bodyLength === 0) {
      issues.push("Production is returning Cloudflare 404 fallback page.");
    }

    if (this.isCloudflare404(prod.body)) {
      issues.push("Cloudflare is not serving index.html.");
    }

    issues.push("Check Cloudflare Pages build settings:");
    issues.push(`• Root directory must be: ${this.expectedRootDir}`);
    issues.push(`• Build command must be: ${this.expectedBuildCommand}`);
    issues.push(`• Output directory must be: ${this.expectedOutputDir}`);
    issues.push(`• Ensure ${this.expectedRedirectsFile} is inside dist/`);

    return issues;
  }
};
