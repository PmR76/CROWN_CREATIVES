@echo off
title CROWN Site Manager - Interactive Menu
cd /d "%~dp0"

:menu
cls
echo ============================================
echo        C R O W N   S I T E   M A N A G E R
echo ============================================
echo.
echo   1. File Tree (GREEN / AMBER / RED)
echo   2. Missing Page Dependencies
echo   3. Sitemap
echo   4. Backup
echo   5. Redundancy Check
echo   6. Exit
echo.
set /p choice="Select an option (1-6): "

if "%choice%"=="1" goto filetree
if "%choice%"=="2" goto missing
if "%choice%"=="3" goto sitemap
if "%choice%"=="4" goto backup
if "%choice%"=="5" goto redundancy
if "%choice%"=="6" exit

echo Invalid choice. Try again.
pause
goto menu

:filetree
cls
echo Running File Tree...
echo.
node manager.mjs filetree
pause
goto menu

:missing
cls
echo Running Missing Dependencies...
echo.
node manager.mjs missing
pause
goto menu

:sitemap
cls
echo Running Sitemap...
echo.
node manager.mjs sitemap
pause
goto menu

:backup
cls
echo Creating Backup...
echo.
node manager.mjs backup
pause
goto menu

:redundancy
cls
echo Running Redundancy Check...
echo.
node manager.mjs redundancy
pause
goto menu
