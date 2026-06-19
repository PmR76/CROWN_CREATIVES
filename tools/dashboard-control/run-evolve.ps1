Write-Host ""
Write-Host "=== EVOLVE OS — Single Entry Launcher ==="
Write-Host ""

# 1. Kill any existing Node servers
Write-Host "Stopping existing Node processes..."
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Start the dashboard server
Write-Host "Starting Dashboard Control Server on port 7777..."
Start-Process -FilePath "node" -ArgumentList "server.mjs" -WorkingDirectory "C:\DEV\CROWN_CREATIVES\tools\dashboard-control"

Start-Sleep -Seconds 2

# 3. Open the OS dashboard
Write-Host "Opening EVOLVE OS Dashboard..."
Start-Process "http://localhost:7777"

Write-Host ""
Write-Host "EVOLVE OS is online."
Write-Host "Double-tap anywhere to activate the OS window."
