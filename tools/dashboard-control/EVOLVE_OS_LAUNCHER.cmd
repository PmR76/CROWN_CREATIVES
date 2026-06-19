@echo off
title EVOLVE OS Launcher
echo.
echo ============================================
echo        C R O W N   O S   L A U N C H E R
echo ============================================
echo.

echo Stopping any running Node servers...
taskkill /IM node.exe /F >nul 2>&1

echo Starting Dashboard Control Server...
cd tools\dashboard-control
start "" node server.mjs

echo Waiting for server to start...
timeout /t 2 >nul

echo Launching EVOLVE OS in browser...
start "" http://localhost:7777

echo.
echo EVOLVE OS is now running.
echo Close this window if you like.
echo.
pause
