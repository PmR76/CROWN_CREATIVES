$reactShared = "C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\shared"
$labShared   = "C:\DEV\CROWN_CREATIVES\test\hero-gallery-lab\shared"

Write-Host "Syncing shared files from React to Lab..."

$files = @(
  "heroCrownEngine.js",
  "heroGalleryEngine.js",
  "hero-crown.css",
  "hero-gallery.css"
)

foreach ($file in $files) {
  $src = Join-Path $reactShared $file
  $dst = Join-Path $labShared   $file

  if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "Copied $file"
  } else {
    Write-Host "Missing source file: $src"
  }
}

Write-Host "Sync complete."
