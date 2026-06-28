@echo off
cd /d "%~dp0"
npx http-server -c-1 -p 5050 .
