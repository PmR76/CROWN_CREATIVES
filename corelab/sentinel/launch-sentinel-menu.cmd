@echo off
cd /d "%~dp0"

REM === Run import case-sensitivity check ===
powershell -ExecutionPolicy Bypass -File "C:\DEV\CROWN_CREATIVES\test\core-lab-react\check-imports.ps1"

REM === Run Sentinel CLI ===
node sentinel-cli.js

pause
