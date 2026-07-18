@echo off
title Crown Core + Sentinel
color 0B

echo ============================================
echo   Starting Crown Core (Vite) + Sentinel...
echo ============================================
echo.

REM --- START REACT DEV SERVER (Vite handles auto-open) ---
cd /d "C:\DEV\CROWN_CREATIVES\test\core-lab-react"
start "Crown Core Dev" cmd /c "npm run dev"

REM --- START SENTINEL (AUTO-RESTART LOOP) ---
cd /d "C:\DEV\CROWN_CREATIVES\sentinel"

:sentinel_loop
echo [Sentinel] Restarting at %date% %time%
node index.js
timeout /t 3 >nul
goto sentinel_loop
