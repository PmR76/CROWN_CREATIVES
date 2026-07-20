@echo off
title Crown Core + Sentinel (Launcher v2.0)
color 0B

echo ============================================
echo   Starting Crown Core (Vite) + Sentinel...
echo ============================================
echo.

REM --- START SENTINEL VIA PM2 IF AVAILABLE ---
echo [SENTINEL] Checking PM2...
pm2 resurrect >nul 2>&1

REM --- IF PM2 DID NOT START SENTINEL, FALL BACK TO MANUAL START ---
echo [SENTINEL] Ensuring backend is running...
cd /d "C:\DEV\CROWN_CREATIVES\sentinel"

pm2 list | findstr /i "sentinel" >nul
if %errorlevel% neq 0 (
    echo [SENTINEL] PM2 did not start Sentinel. Starting manually...
    start "Sentinel Backend" cmd /k "node index.js"
) else (
    echo [SENTINEL] Sentinel is running under PM2.
)

REM --- START REACT DEV SERVER (VITE) ---
echo [CORE] Starting Vite dev server...
cd /d "C:\DEV\CROWN_CREATIVES\test\core-lab-react"
start "Crown Core Dev" cmd /k "npm run dev"

REM --- OPEN BROWSER ---
echo [BROWSER] Opening Core-Lab Realm...
start http://localhost:5173

echo [BROWSER] Opening Sentinel backend status...
start http://localhost:5175/sentinel/status

echo.
echo ============================================
echo   Launcher v2.0 Complete
echo ============================================
