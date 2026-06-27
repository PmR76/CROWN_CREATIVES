@echo off
title Crown Creatives — Generate Lab

cd /d "%~dp0"

if "%~1"=="" (
  echo ❌ No lab name provided.
  echo Usage: generate-lab.cmd cards
  pause
  exit /b
)

call run-node.cmd lab-generator.js %1
