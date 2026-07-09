@echo off
setlocal

REM ============================================================
REM  Crown Creatives — Core Lab React Launcher (Vite)
REM ============================================================

REM --- Always start from the project root ---
cd /d "%~dp0"

echo.
echo  🔵 Launching Core Lab React (Vite Dev Server)
echo  📁 Working Directory: %cd%
echo.

REM --- Start Vite dev server ---
call npm run dev

echo.
echo  🟢 Core Lab React is running.
echo  🌐 Open your browser at: http://localhost:5173
echo.

endlocal
