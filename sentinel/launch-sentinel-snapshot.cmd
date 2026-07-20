@echo off
setlocal

REM --- Force correct working directory ---
cd /d "%~dp0"

REM --- Run Sentinel ---
node sentinel.js

REM --- Keep window open ---
pause
