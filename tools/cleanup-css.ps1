# ============================================================
# CROWN CREATIVES — LAYER 2 CSS CLEANUP PROGRAM
# Removes legacy/duplicate CSS files and archives them safely
# ============================================================

$root      = "C:\DEV\CROWN_CREATIVES"
$archive   = "$root\archive.disabled"
$sentUI    = "$root\sentinel\sentinel-ui-conflicts.json"

# Ensure archive folder exists
if (!(Test-Path $archive)) {
    New-Item -ItemType Directory -Path $archive | Out-Null
}

Write-Host "=== LAYER 2 — CSS CLEANUP START ===" -ForegroundColor Cyan

# Load UI conflict report
$uiConflicts = Get-Content $sentUI | ConvertFrom-Json

# CSS conflicts list
$cssConflicts = $uiConflicts.cssConflicts

if ($cssConflicts.Count -eq 0) {
    Write-Host "No CSS conflicts found. Layer 2 already clean." -ForegroundColor Green
    exit
}

foreach ($conflict in $cssConflicts) {

    $name = $conflict.name
    $folder = $conflict.folder

    Write-Host ""
    Write-Host "Processing CSS conflict: $name" -ForegroundColor Yellow

    # Find ALL copies of this CSS file across the project
    $allMatches = Get-ChildItem -Path $root -Recurse -Filter $name -ErrorAction SilentlyContinue

    if ($allMatches.Count -eq 0) {
        Write-Host "No copies found for $name" -ForegroundColor DarkGray
        continue
    }

    # Canonical CSS file (the one inside core-lab-react)
    $canonical = $allMatches | Where-Object {
        $_.FullName -like "*test\core-lab-react\src\styles*"
    }

    if ($canonical.Count -eq 0) {
        Write-Host "WARNING: No canonical version found for $name" -ForegroundColor Red
        continue
    }

    $canonicalFile = $canonical[0]
    Write-Host "Keeping canonical: $($canonicalFile.FullName)" -ForegroundColor Green

    # Archive all other copies
    foreach ($file in $allMatches) {
        if ($file.FullName -ne $canonicalFile.FullName) {
            $dest = Join-Path $archive $file.Name
            Write-Host "Archiving legacy CSS: $($file.FullName)" -ForegroundColor Magenta
            Move-Item -Path $file.FullName -Destination $dest -Force
        }
    }
}

# ------------------------------------------------------------
# DISABLE LEGACY UI FOLDERS (master, labs)
# ------------------------------------------------------------

$legacyFolders = @(
    "$root\master",
    "$root\labs"
)

foreach ($folder in $legacyFolders) {
    if (Test-Path $folder) {
        $disabled = $folder + ".disabled"
        Write-Host ""
        Write-Host "Disabling legacy UI folder: $folder" -ForegroundColor Red
        Rename-Item -Path $folder -NewName $disabled -Force
    }
}

Write-Host ""
Write-Host "=== LAYER 2 CSS CLEANUP COMPLETE ===" -ForegroundColor Cyan
Write-Host "Run Sentinel again to confirm cssConflicts is empty." -ForegroundColor Cyan
