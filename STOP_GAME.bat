@echo off
title Stop FIONA Game Server
color 0C

echo ========================================
echo    Stopping FIONA Game Server
echo ========================================
echo.

REM Kill all Node.js processes running on port 8080
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Stopping process %%a...
    taskkill /F /PID %%a
)

echo.
echo Game server stopped!
echo ========================================
timeout /t 3
