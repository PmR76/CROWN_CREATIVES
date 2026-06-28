@echo off
cd /d "%~dp0"

REM Start local server inside THIS lab folder
start "" npx http-server -c-1 -p 5050 .

REM Launch Chrome directly to this lab
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:5050/cards-lab.html
