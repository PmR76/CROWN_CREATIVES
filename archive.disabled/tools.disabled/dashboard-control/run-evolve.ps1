Write-Host ""
Write-Host "=== EVOLVE OS - Single Entry Launcher ==="
Write-Host ""

Write-Host "Stopping existing Node processes..."
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting Dashboard Control Server on port 7777..."
Start-Process -FilePath "node" -ArgumentList "server.mjs" -WorkingDirectory "C:\DEV\CROWN_CREATIVES\tools\dashboard-control"

Start-Sleep -Seconds 2

Write-Host "Opening EVOLVE OS Dashboard..."
Start-Process "http://localhost:7777"

Write-Host ""
Write-Host "EVOLVE OS is online."
Write-Host "Double-tap anywhere to activate the OS window."
Write-Host ""
