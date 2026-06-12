@echo off
title MOTHER v5 - Auto-Fix Engine

REM Move to the folder containing this CMD (CROWN_CREATIVES)
cd /d "%~dp0"

REM Run auto-fix mode
node tools/mother/mother-v5.js --fix

pause
