@echo off
setlocal

REM Adjust this if your project path ever changes
set PROJECT_ROOT=C:\Users\royal\OneDrive\Dremel_Print\01_Website\CROWN_CREATIVES

cd /d "%PROJECT_ROOT%\tools"

echo Running Crown Creatives Scanner v2...
echo.

node cc-scanner.cjs "%PROJECT_ROOT%"

echo.
echo Scan complete. Press any key to close.
pause >nul
