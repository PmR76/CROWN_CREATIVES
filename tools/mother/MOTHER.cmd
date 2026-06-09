@echo off
title MOTHER // CROWN CREATIVES CSS CORE
color 0A

echo ███ MOTHER // CROWN CREATIVES CSS CORE ███
echo CHANNEL: DIAGNOSTIC
echo MODE: OVERFLOW + DUPLICATION SCAN
echo.

REM Go to project root
cd /d "%~dp0..\.."

REM Run scanner
node tools/mother/mother-scan.js

echo.
echo ▌ SCAN COMPLETE.
echo ▌ REPORT: tools\mother\mother-report.md
echo.
pause
