@echo off
title Crown Creatives — Master Server

echo Starting Crown Creatives Master System...
echo -----------------------------------------
echo.

cd /d "%~dp0"

start "" http://localhost:8080/index.html

npx http-server . -p 8080

pause
