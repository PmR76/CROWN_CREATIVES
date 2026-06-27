@echo off
title Crown Creatives — Validate Labs

cd /d "%~dp0"

call run-node.cmd lab-validator.js
