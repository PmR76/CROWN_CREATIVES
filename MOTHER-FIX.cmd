@echo off
title MOTHER v5 - Auto-Fix Engine

REM Move to the folder containing this CMD
cd /d "%~dp0"

REM Move up TWO levels to reach CROWN_CREATIVES
cd ../..

REM Run auto-fix mode
node tools/mother/mother-v5.js --fix

pause
