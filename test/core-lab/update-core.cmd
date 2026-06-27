@echo off
title Crown Creatives — Update Core Lab

cd /d "%~dp0"

call ..\run-node.cmd core-lab-generator.js
