@echo off
cd /d "C:\DEV\CROWN_CREATIVES\test"

start "" powershell -WindowStyle Hidden -Command "npx http-server -c-1 -p 5058 ."

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:5058/core-lab/core-lab.html
