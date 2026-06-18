Write-Host "=== CROWN_CREATIVES OS VALIDATION ===" -ForegroundColor Cyan

# 1. Locate project root (CROWN_CREATIVES)
$possibleRoots = @(
    "C:\Users\royal\OneDrive\Dremel_Print\01_Website\CROWN_CREATIVES",
    (Resolve-Path ".").Path
)

$projectRoot = $null
foreach ($root in $possibleRoots) {
    if (Test-Path $root -PathType Container) {
        $projectRoot = $root
        break
    }
}

if (-not $projectRoot) {
    Write-Host "✘ Project root not found" -ForegroundColor Red
    exit 1
}

Write-Host "`nProject Root:" $projectRoot -ForegroundColor Green

# 2. Define key paths
$gr3RootPath  = Join-Path $projectRoot "gr3-auto-fix\gr3-auto-fix.mjs"
$gr3ToolsPath = Join-Path $projectRoot "tools\gr3-auto-fix\gr3-auto-fix.mjs"
$reportsPath  = Join-Path $projectRoot "reports"

Write-Host "`n--- GR3 FILES ---"
Write-Host "Root GR3:  $gr3RootPath"
Write-Host "Tools GR3: $gr3ToolsPath"

# 3. Check GR3 files exist
$gr3RootExists  = Test-Path $gr3RootPath
$gr3ToolsExists = Test-Path $gr3ToolsPath

if ($gr3RootExists) {
    Write-Host "✔ Root GR3 file exists" -ForegroundColor Green
} else {
    Write-Host "✘ Root GR3 file missing" -ForegroundColor Red
}

if ($gr3ToolsExists) {
    Write-Host "✔ Tools GR3 file exists" -ForegroundColor Green
} else {
    Write-Host "✘ Tools GR3 file missing" -ForegroundColor Yellow
}

# 4. If root GR3 exists, ensure tools GR3 matches it
if ($gr3RootExists) {
    Write-Host "`n--- Ensuring tools GR3 matches root GR3 ---"

    if (-not $gr3ToolsExists) {
        Write-Host "Tools GR3 missing, creating from root..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Force (Split-Path $gr3ToolsPath) | Out-Null
        Copy-Item $gr3RootPath $gr3ToolsPath -Force
        Write-Host "✔ Tools GR3 created from root" -ForegroundColor Green
    } else {
        $rootHash  = (Get-FileHash $gr3RootPath -Algorithm SHA256).Hash
        $toolsHash = (Get-FileHash $gr3ToolsPath -Algorithm SHA256).Hash

        if ($rootHash -ne $toolsHash) {
            Write-Host "Tools GR3 differs from root, overwriting..." -ForegroundColor Yellow
            Copy-Item $gr3RootPath $gr3ToolsPath -Force
            Write-Host "✔ Tools GR3 now matches root" -ForegroundColor Green
        } else {
            Write-Host "✔ Tools GR3 already matches root" -ForegroundColor Green
        }
    }
}

# 5. Validate reports directory
Write-Host "`n--- Reports Directory ---"
Write-Host "Reports path: $reportsPath"

if (Test-Path $reportsPath -PathType Container) {
    Write-Host "✔ Reports directory exists" -ForegroundColor Green
    $reports = Get-ChildItem $reportsPath -Filter "scan-*.json" | Sort-Object Name
    if ($reports.Count -gt 0) {
        $latest = $reports[-1]
        Write-Host "Latest report:" $latest.Name " (" $latest.LastWriteTime ")" -ForegroundColor Green
    } else {
        Write-Host "✘ No scan-*.json reports found" -ForegroundColor Yellow
    }
} else {
    Write-Host "✘ Reports directory missing" -ForegroundColor Red
}

# 6. Run GR3 from tools (same as dashboard server)
Write-Host "`n--- Running GR3 (tools version) ---"
$gr3Cmd = "node `"$gr3ToolsPath`""
Write-Host "Command: $gr3Cmd" -ForegroundColor Cyan

try {
    & node $gr3ToolsPath
} catch {
    Write-Host "✘ GR3 execution failed:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n=== VALIDATION COMPLETE ===" -ForegroundColor Cyan
