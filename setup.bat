@echo off
echo Installing Web to APK Platform...
echo.

echo Step 1: Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo Step 3: Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo Step 4: Creating environment file...
if not exist .env (
    copy .env.example .env
    echo Environment file created from example
) else (
    echo Environment file already exists
)

echo.
echo Step 5: Creating required directories...
if not exist "uploads" mkdir uploads
if not exist "generated-apps" mkdir generated-apps
echo Directories created

echo.
echo Installation completed successfully!
echo.
echo To start the application:
echo 1. Run backend: npm run dev-backend
echo 2. Run frontend: npm run dev-frontend
echo 3. Open http://localhost:3000 in your browser
echo.
pause