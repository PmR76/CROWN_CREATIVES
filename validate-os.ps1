Write-Host "=== CROWN_CREATIVES OS VALIDATION ==="

$projectRoot = Resolve-Path "."
Write-Host ""
Write-Host "Project Root: $projectRoot"

$gr3RootPath  = Join-Path $projectRoot "gr3-auto-fix\gr3-auto-fix.mjs"
$gr3ToolsPath = Join-Path $projectRoot "tools\gr3-auto-fix\gr3-auto-fix.mjs"
$reportsPath  = Join-Path $projectRoot "reports"

Write-Host ""
Write-Host "--- GR3 FILES ---"
Write-Host "Root GR3:  $gr3RootPath"
Write-Host "Tools GR3: $gr3ToolsPath"

$gr3RootExists  = Test-Path $gr3RootPath
$gr3ToolsExists = Test-Path $gr3ToolsPath

if ($gr3RootExists) { Write-Host "Root GR3 exists" } else { Write-Host "Root GR3 missing" }
if ($gr3ToolsExists) { Write-Host "Tools GR3 exists" } else { Write-Host "Tools GR3 missing" }

Write-Host ""
Write-Host "--- Syncing Tools GR3 with Root GR3 ---"

if ($gr3RootExists -and $gr3ToolsExists) {
    $rootHash  = (Get-FileHash $gr3RootPath -Algorithm SHA256).Hash
    $toolsHash = (Get-FileHash $gr3ToolsPath -Algorithm SHA256).Hash

    if ($rootHash -ne $toolsHash) {
        Write-Host "Files differ. Updating tools version..."
        Copy-Item $gr3RootPath $gr3ToolsPath -Force
        Write-Host "Tools GR3 updated."
    } else {
        Write-Host "Tools GR3 already matches root."
    }
}

if ($gr3RootExists -and -not $gr3ToolsExists) {
    Write-Host "Tools GR3 missing. Creating folder and copying..."
    New-Item -ItemType Directory -Force (Split-Path $gr3ToolsPath) | Out-Null
    Copy-Item $gr3RootPath $gr3ToolsPath -Force
    Write-Host "Tools GR3 created."
}

Write-Host ""
Write-Host "--- Reports Directory ---"
Write-Host "Reports path: $reportsPath"

if (Test-Path $reportsPath) {
    Write-Host "Reports directory exists"
    $reports = Get-ChildItem $reportsPath -Filter "scan-*.json" | Sort-Object Name
    if ($reports.Count -gt 0) {
        $latest = $reports[-1]
        Write-Host "Latest report: $($latest.Name)"
    } else {
        Write-Host "No scan reports found"
    }
} else {
    Write-Host "Reports directory missing"
}

Write-Host ""
Write-Host "--- Running GR3 (tools version) ---"
try {
    & node $gr3ToolsPath
} catch {
    Write-Host "GR3 execution failed"
}

Write-Host ""
Write-Host "=== VALIDATION COMPLETE ==="
