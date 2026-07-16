@echo off
title Crown Core + Sentinel
color 0B

echo ============================================
echo   Starting Crown Core (Vite) + Sentinel...
echo ============================================
echo.

REM --- START REACT DEV SERVER ---
cd /d "C:\DEV\CROWN_CREATIVES\test\core-lab-react"
start "Crown Core Dev" cmd /c "npm run dev"

REM --- START SENTINEL (AUTO-RESTART) ---
cd /d "C:\DEV\CROWN_CREATIVES\sentinel"

:sentinel_loop
node index.js
timeout /t 3 >nul
goto sentinel_loop
