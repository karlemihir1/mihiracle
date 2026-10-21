@echo off
title Mihiracle Terminal
cd /d "%~dp0"
set "PATH=%~dp0tools\node20;%PATH%"

echo ===================================================
echo   Mihiracle Terminal Environment
echo   Directory: %CD%
echo ===================================================
echo.
echo Node: 
node -v
echo npm: 
call npm -v
echo.
echo Quick commands:
echo   npm run dev    - Start server and client
echo   npm run build  - Build production PWA
echo   npm run test   - Run Vitest tests
echo.
powershell -NoExit -Command "Set-Location '%~dp0'"
