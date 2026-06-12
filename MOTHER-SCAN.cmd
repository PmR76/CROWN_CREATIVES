@echo off
title MOTHER v5 - Diagnostic Scan

REM Move to the folder containing this CMD (CROWN_CREATIVES)
cd /d "%~dp0"

REM Run the scanner from tools/mother
node tools/mother/mother-v5.js

pause
