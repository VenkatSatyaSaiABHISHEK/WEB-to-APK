@echo off
title Web to APK Platform

echo Starting Web to APK Platform...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /f /im node.exe > nul 2>&1
echo Servers stopped.
pause