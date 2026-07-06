@echo off
title Crown Creatives — Core Lab React Launcher

echo.
echo ================================================
echo   Crown Creatives — Core Lab React Launcher
echo ================================================
echo.

REM --- Move to project directory ---
cd /d C:\DEV\CROWN_CREATIVES\test\core-lab-react

REM --- Ensure node_modules exists ---
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM --- Kill common Vite ports (5173–5176) ---
echo Clearing ports...
npx kill-port 5173 >nul 2>&1
npx kill-port 5174 >nul 2>&1
npx kill-port 5175 >nul 2>&1
npx kill-port 5176 >nul 2>&1

REM --- Start Vite ---
echo Starting Vite dev server...
npm run dev

pause
