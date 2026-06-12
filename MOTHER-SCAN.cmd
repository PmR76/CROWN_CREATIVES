@echo off
title MOTHER v5 - Diagnostic Scan

REM Move to the folder containing this CMD
cd /d "%~dp0"

REM Move up TWO levels to reach CROWN_CREATIVES
cd ../..

REM Run the scanner from tools/mother
node tools/mother/mother-v5.js

pause
