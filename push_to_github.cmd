@echo off
title Push Mihiracle to GitHub (100%% Free Cloud)
cd /d "%~dp0"
set "PATH=%~dp0tools\node20;%PATH%"

echo ===================================================
echo   Mihiracle - Push to GitHub (100%% Free Deployment)
echo ===================================================
echo.
echo Make sure you have created an empty repository on GitHub:
echo https://github.com/new
echo (You can name it 'mihiracle' and make it Public or Private)
echo.
set /p REPO_URL="Paste your GitHub repository URL here: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo [*] Setting branch to main...
git branch -M main

echo [*] Linking remote repository...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [*] Pushing your code to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Push failed. If it asks you to sign in, please sign in to GitHub in your browser.
    echo     Then run this script again.
) else (
    echo.
    echo [SUCCESS] Code pushed to GitHub!
    echo.
    echo Next step to turn on GitHub Pages:
    echo 1. Open your repository on GitHub in your browser.
    echo 2. Go to "Settings" tab ^> Click "Pages" on the left menu.
    echo 3. Under "Build and deployment" -^> "Source", change it to:
    echo        "GitHub Actions"
    echo 4. GitHub will automatically build and publish your app!
    echo    In ~60 seconds, your live link will be ready:
    echo        https://^<your-username^>.github.io/mihiracle/
)

echo.
pause
