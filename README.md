# Web to APK Platform

A comprehensive platform that allows users to convert websites into Android APK files with a dashboard to track downloads and manage generated apps.

## Features

- 🌐 Convert any website URL into an Android APK
- 🎨 Customize app name, icon, and appearance
- 📊 Dashboard with download analytics
- 📱 Share generated APK files
- 👥 User management and tracking
- 💾 SQLite database for data storage

## Quick Start

### Installation

1. Clone or download this project
2. Install all dependencies:
```bash
npm run install-all
```

### Development

1. Start the backend server:
```bash
npm run dev-backend
```

2. Start the frontend (in a new terminal):
```bash
npm run dev-frontend
```

3. Open your browser and go to `http://localhost:3000`

### Production

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
web-to-apk-platform/
├── backend/           # Node.js Express server
├── frontend/          # React.js frontend
├── generated-apps/    # Generated APK files storage
├── uploads/          # User uploaded images/icons
└── database.sqlite   # SQLite database
```

## API Endpoints

- `POST /api/generate-app` - Generate APK from website URL
- `GET /api/apps` - Get all generated apps
- `GET /api/download/:id` - Download APK file
- `POST /api/upload-icon` - Upload custom app icon
- `GET /api/stats/:id` - Get download statistics

## Requirements

- Node.js 16+ 
- Android SDK (for APK generation)
- Cordova CLI

## License

MIT License