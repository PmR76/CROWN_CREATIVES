@echo off
cd /d "%~dp0"
npx http-server -c-1 -p 5050 .
start http://127.0.0.1:5050/<lab-sounds>-lab.html
