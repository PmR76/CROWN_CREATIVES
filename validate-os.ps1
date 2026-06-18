Write-Host "=== CROWN_CREATIVES OS VALIDATION ===" -ForegroundColor Cyan

# -------------------------------
# 1. Detect project root
# -------------------------------
$projectRoot = Resolve-Path "."

Write-Host ""
Write-Host "Project Root: $projectRoot" -ForegroundColor Green

# -------------------------------
# 2. Define key paths
# -------------------------------
$gr3RootPath  = Join-Path $projectRoot "gr3-auto-fix\gr3-auto-fix.mjs"
$gr3ToolsPath = Join-Path $projectRoot "tools\gr3-auto-fix\gr3-auto-fix.mjs"
$reportsPath  = Join-Path $projectRoot "reports"

Write-Host ""
Write-Host "--- GR3 FILES ---"
Write-Host "Root GR3:  $gr3RootPath"
Write-Host "Tools GR3: $gr3ToolsPath"

# -------------------------------
# 3. Check GR3 file existence
# -------------------------------
$gr3RootExists  = Test-Path $gr3RootPath
$gr3ToolsExists = Test-Path $gr3ToolsPath

if ($gr3RootExists) {
    Write-Host "✔ Root GR3 exists" -ForegroundColor Green
} else {
    Write-Host "✘ Root GR3 missing" -ForegroundColor Red
}

if ($gr3ToolsExists) {
    Write-Host "✔ Tools GR3 exists" -ForegroundColor Green
} else {
    Write-Host "✘ Tools GR3 missing" -ForegroundColor Yellow
}

# -------------------------------
# 4. Sync tools GR3 with root GR3
# -------------------------------
Write-Host ""
Write-Host "--- Syncing Tools GR3 with Root GR3 ---"

if ($gr3RootExists) {

    if (-not $gr3ToolsExists) {
        Write-Host "Tools GR3 missing — creating folder and copying..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Force (Split-Path $gr3ToolsPath) | Out-Null
        Copy-Item $gr3RootPath $gr3ToolsPath -Force
        Write-Host "✔ Tools GR3 created from root" -ForegroundColor Green
    }
    else {
        $rootHash  = (Get-FileHash $gr3RootPath -Algorithm SHA256).Hash
        $toolsHash = (Get-FileHash $gr3ToolsPath -Algorithm SHA256).Hash

        if ($rootHash -ne $toolsHash) {
            Write-Host "Tools GR3 differs — overwriting with root version..." -ForegroundColor Yellow
            Copy-Item $gr3RootPath $gr3ToolsPath -Force
            Write-Host "✔ Tools GR3 updated" -ForegroundColor Green
        }
        else {
            Write-Host "✔ Tools GR3 already matches root" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "✘ Cannot sync — root GR3 missing" -ForegroundColor Red
}

# -------------------------------
# 5. Validate reports directory
# -------------------------------
Write-Host ""
Write-Host "--- Reports Directory ---"
Write-Host "Reports path: $reportsPath"

if (Test-Path $reportsPath) {
    Write-Host "✔ Reports directory exists" -ForegroundColor Green

    $reports = Get-ChildItem $reportsPath -Filter "scan-*.json" | Sort-Object Name

    if ($reports.Count -gt 0) {
        $latest = $reports[-1]
        Write-Host "Latest report: $($latest.Name) ($($latest.LastWriteTime))" -ForegroundColor Green
    }
    else {
        Write-Host "✘ No scan-*.json reports found" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✘ Reports directory missing" -ForegroundColor Red
}

# -------------------------------
# 6. Run GR3 (tools version)
# -------------------------------
Write-Host ""
Write-Host "--- Running GR3 (tools version) ---"

try {
    & node $gr3ToolsPath
}
catch {
    Write-Host "✘ GR3 execution failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== VALIDATION COMPLETE ===" -ForegroundColor Cyan
