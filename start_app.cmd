@echo off
title Mihiracle App Launcher
cd /d "%~dp0"

:: Ensure bundled Node 20 runtime is at front of PATH
set "PATH=%~dp0tools\node20;%PATH%"

echo ===================================================
echo   Mihiracle Microlearning App Launcher
echo   Directory: %CD%
echo ===================================================
echo.
echo [1/2] Checking local Node 20 environment...
call node -v
echo.
echo [2/2] Starting PWA Frontend and API Backend...
echo.
echo - Web App:     http://localhost:5173
echo - Phone Mobile: Double-click start_online_mobile.cmd for phone link & QR code
echo - API Server:  http://localhost:3001
echo.
echo Your browser will open automatically in a moment.
echo (Keep this window open while using the app)
echo ===================================================
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo ===================================================
    echo An error occurred while running Mihiracle.
    echo Press any key to exit.
    echo ===================================================
    pause
)
