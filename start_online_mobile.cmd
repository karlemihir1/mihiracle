@echo off
title Mihiracle Mobile ^& Online Engine
cd /d "%~dp0"
set "PATH=%~dp0tools\node20;%PATH%"

node "%~dp0tools\mobile_launcher.mjs"

if errorlevel 1 (
    echo.
    echo ========================================================
    echo   An error occurred while launching Mihiracle.
    echo   Press any key to exit.
    echo ========================================================
    pause
)
