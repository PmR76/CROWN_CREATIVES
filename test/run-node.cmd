@echo off
title Crown Creatives — Node Launcher

echo Crown Creatives Node Launcher
echo --------------------------------
echo.

cd /d "%~dp0"

REM Check Node
node -v >nul 2>&1
if errorlevel 1 (
  echo ❌ Node.js is not installed or not in PATH.
  pause
  exit /b
)

if "%~1"=="" (
  echo ❌ No script specified.
  echo Usage: run-node.cmd script.js
  pause
  exit /b
)

echo Running: %1
echo --------------------------------
echo.

node "%~1"

echo.
echo ✔ Finished.
pause
