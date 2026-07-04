@echo off
cd /d "%~dp0"
start "" npx http-server -c-1 -p 5056 .
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:5056/footer-lab.html
