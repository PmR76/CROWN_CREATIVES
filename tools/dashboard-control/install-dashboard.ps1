# ============================================
# DASHBOARD INSTALLER FOR CROWN_CREATIVES
# Creates correct folder structure and copies UI files
# ============================================

Write-Host ""
Write-Host "=== Installing Dashboard Structure ==="
Write-Host ""

$root = "C:\DEV\CROWN_CREATIVES\tools"
$dashboard = Join-Path $root "dashboard-control"
$scannerDashboard = Join-Path $root "scanner-dashboard"
$public = Join-Path $dashboard "public"

# Target folders
$css = Join-Path $public "css"
$js = Join-Path $public "js"
$modules = Join-Path $public "modules"
$assets = Join-Path $public "assets"

# Ensure directory exists
function Ensure-Folder($path) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Host "📁 Created: $path"
    } else {
        Write-Host "✔ Exists: $path"
    }
}

# Copy file safely
function Safe-Copy($src, $dest) {
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
        Write-Host "📄 Copied: $src → $dest"
    } else {
        Write-Host "⚠ Missing file: $src"
    }
}

# 1. Create folder structure
Ensure-Folder $public
Ensure-Folder $css
Ensure-Folder $js
Ensure-Folder $modules
Ensure-Folder $assets

# 2. Copy dashboard.html and index.html
Safe-Copy (Join-Path $scannerDashboard "dashboard.html") (Join-Path $public "dashboard.html")
Safe-Copy (Join-Path $scannerDashboard "index.html") (Join-Path $public "index.html")

# 3. Create placeholder files
Set-Content -Path (Join-Path $css "placeholder.css") -Value "/* dashboard css */"
Set-Content -Path (Join-Path $js "placeholder.js") -Value "// dashboard js"
Set-Content -Path (Join-Path $modules "placeholder.txt") -Value "modules go here"
Set-Content -Path (Join-Path $assets "placeholder.txt") -Value "assets go here"

Write-Host ""
Write-Host "🎉 Dashboard structure installed successfully!"
Write-Host "➡ Now run:  node server.mjs"
Write-Host ""
