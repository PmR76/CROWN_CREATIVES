@echo off
title CORELAB DIAGNOSTICS LAUNCHER
color 0B

echo ================================================
echo        CORELAB DIAGNOSTICS LAUNCHER
echo ================================================
echo.
echo   1. Run CSS Conflict Scanner
echo   2. Run Ghost Scanner
echo   3. Run GR3 Diagnostic
echo   4. Run Quarantine Ghosts
echo   5. Run Restore Core Files
echo   6. Run Auto Restore Core
echo   0. Exit
echo.
set /p choice="Select an option: "

if "%choice%"=="1" (
    echo Running CSS Conflict Scanner...
    node src/diagnostics/cssConflictScanner.js
    pause
    exit /b
)

if "%choice%"=="2" (
    echo Running Ghost Scanner...
    node src/diagnostics/ghostScanner.js
    pause
    exit /b
)

if "%choice%"=="3" (
    echo Running GR3 Diagnostic...
    node src/diagnostics/gr3-diagnostic.js
    pause
    exit /b
)

if "%choice%"=="4" (
    echo Running Quarantine Ghosts...
    node src/diagnostics/quarantineGhosts.js
    pause
    exit /b
)

if "%choice%"=="5" (
    echo Restoring Core Files...
    node src/diagnostics/restoreCoreFiles.js
    pause
    exit /b
)

if "%choice%"=="6" (
    echo Running Auto Restore Core...
    node src/diagnostics/autoRestoreCore.js
    pause
    exit /b
)

if "%choice%"=="0" (
    exit /b
)

echo Invalid choice.
pause
exit /b
if "%choice%"=="7" (
    echo Running CSS Auto-Fixer...
    node src/diagnostics/cssAutoFixer.js
    pause
    exit /b
)
