# ============================================================
# CROWN CREATIVES — LAYER 1 CLEANUP PROGRAM (Duplicates + Legacy)
# Moves all duplicates into archive.disabled
# ============================================================

$root      = "C:\DEV\CROWN_CREATIVES"
$archive   = "$root\archive.disabled"
$sentDupes = "$root\sentinel\sentinel-duplicates.json"

# Ensure archive folder exists
if (!(Test-Path $archive)) {
    New-Item -ItemType Directory -Path $archive | Out-Null
}

Write-Host "=== CROWN CREATIVES — LAYER 1 CLEANUP START ===" -ForegroundColor Cyan

# Load duplicates list
$duplicates = Get-Content $sentDupes | ConvertFrom-Json

foreach ($item in $duplicates) {

    $name = $item.name
    $locations = $item.locations

    Write-Host ""
    Write-Host "Processing duplicate: $name" -ForegroundColor Yellow

    $foundFiles = @()

    foreach ($loc in $locations) {
        $fullPath = Join-Path $root $loc

        if (Test-Path $fullPath) {
            $files = Get-ChildItem -Path $fullPath -Filter $name -ErrorAction SilentlyContinue
            if ($files) {
                $foundFiles += $files
            }
        }
    }

    if ($foundFiles.Count -eq 0) {
        Write-Host "No files found for $name" -ForegroundColor DarkGray
        continue
    }

    # Keep the first file as canonical
    $canonical = $foundFiles[0]
    Write-Host "Keeping canonical: $($canonical.FullName)" -ForegroundColor Green

    # Move all others to archive.disabled
    if ($foundFiles.Count -gt 1) {
        foreach ($file in $foundFiles[1..($foundFiles.Count - 1)]) {
            $dest = Join-Path $archive $file.Name

            Write-Host "Archiving duplicate: $($file.FullName)" -ForegroundColor Magenta
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
        Write-Host "Disabling legacy folder: $folder" -ForegroundColor Red
        Rename-Item -Path $folder -NewName $disabled -Force
    }
}

Write-Host ""
Write-Host "=== LAYER 1 CLEANUP COMPLETE ===" -ForegroundColor Cyan
Write-Host "Run Sentinel again to confirm status is GREEN." -ForegroundColor Cyan
