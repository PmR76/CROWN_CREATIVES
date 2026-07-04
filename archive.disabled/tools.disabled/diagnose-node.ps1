Write-Host "=== NODE + FILESYSTEM DIAGNOSTIC ===`n"

# 1. Show PowerShell working directory
Write-Host "PowerShell CWD:" (Get-Location).Path

# 2. Compute expected GR3 path
$projectRoot = Resolve-Path "..\"
$gr3Path = Join-Path $projectRoot "tools\gr3-auto-fix\gr3-auto-fix.mjs"
$reportsPath = Join-Path $projectRoot "reports"

Write-Host "`nExpected PROJECT_ROOT:" $projectRoot
Write-Host "Expected GR3 path:" $gr3Path
Write-Host "Expected REPORTS_DIR:" $reportsPath

# 3. Check existence
Write-Host "`nFile exists (GR3):" (Test-Path $gr3Path)
Write-Host "Directory exists (reports):" (Test-Path $reportsPath)

# 4. List reports if available
if (Test-Path $reportsPath) {
    Write-Host "`nReports found:"
    Get-ChildItem $reportsPath -Filter "scan-*.json" | Select-Object Name, LastWriteTime
} else {
    Write-Host "`nReports directory not accessible."
}

# 5. Ask Node directly what it sees
Write-Host "`n=== NODE PATH CHECK ==="
Write-Host "Node version:" (node -v)

Write-Host "`nNode sees CWD as:"
node -e "console.log(process.cwd())"

Write-Host "`nNode sees GR3 file exists:"
node -e "console.log(require('fs').existsSync('$gr3Path'))"

Write-Host "`nNode sees reports directory exists:"
node -e "console.log(require('fs').existsSync('$reportsPath'))"

Write-Host "`n=== END OF DIAGNOSTIC ==="
