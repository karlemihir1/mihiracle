@echo off
title Mihiracle - Fast Rebuild
cd /d "%~dp0"
set "PATH=%~dp0tools\node20;%PATH%"

echo ========================================================
echo   MIHIRACLE - Fast Frontend Rebuild
echo ========================================================
echo.
echo [*] Compiling changes in src/ to production bundle...
call npm run build

if errorlevel 1 (
    echo.
    echo [!] Build failed. See error output above.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   [✓] SUCCESS! App changes compiled successfully.
echo.
echo   Your installed mobile app checks for updates automatically
echo   and will refresh to show the new changes!
echo ========================================================
echo.
timeout /t 3 /nobreak >nul
