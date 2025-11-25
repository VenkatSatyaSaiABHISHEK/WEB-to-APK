#!/bin/bash
echo "Installing Web to APK Platform..."
echo

echo "Step 1: Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing root dependencies"
    exit 1
fi

echo
echo "Step 2: Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

cd ..
echo
echo "Step 3: Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi

cd ..
echo
echo "Step 4: Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Environment file created from example"
else
    echo "Environment file already exists"
fi

echo
echo "Step 5: Creating required directories..."
mkdir -p uploads generated-apps
echo "Directories created"

echo
echo "Installation completed successfully!"
echo
echo "To start the application:"
echo "1. Run backend: npm run dev-backend"
echo "2. Run frontend: npm run dev-frontend"
echo "3. Open http://localhost:3000 in your browser"
echo