@echo off
title Sentinel Watchkeeper Server
color 0B

echo ============================================
echo   Starting Sentinel Watchkeeper Backend...
echo ============================================
echo.

REM Change directory to the Sentinel server folder
cd /d "%~dp0"

REM Start the server
node sentinel.js

echo.
echo ============================================
echo   Sentinel server stopped or crashed.
echo   Press any key to close this window.
echo ============================================
pause >nul
