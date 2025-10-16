@echo off
title FIONA - Algebra Adventure Game
color 0A

echo ========================================
echo    FIONA - Algebra Adventure Game
echo ========================================
echo.
echo Starting development server...
echo.
echo The game will open automatically in your browser.
echo Server is running at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:8080
npm run dev

pause
