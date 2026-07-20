@echo off
setlocal

REM ============================================================
REM  Crown Creatives — Core Lab React Launcher (Vite + Watchers)
REM ============================================================

REM --- Always start from the project root ---
cd /d "%~dp0"

echo.
echo  🔵 Launching Core Lab React (Vite Dev Server)
echo  📁 Working Directory: %cd%
echo.

REM --- Auto-open browser (Chrome) ---
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:5173

REM --- Start Vite dev server ---
call npm run dev

echo.
echo  🟢 Core Lab React is running.
echo  🌐 Open your browser at: http://localhost:5173
echo.

REM --- START WATCHERS ---
echo [WATCHERS] Starting gallery + sound watchers...
cd /d C:\DEV\CROWN_CREATIVES\scripts
start "Gallery Watcher" cmd /k "node build-manifests.js"
start "Sound Watcher" cmd /k "node build-sound-manifest.js"

echo.
echo  🟢 Watchers running (Gallery + Sound)
echo.

endlocal
