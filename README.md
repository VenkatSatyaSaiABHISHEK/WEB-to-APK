# 🚀 Web-to-APK Platform

Transform any website into a native Android APK application with custom branding and advanced features.

## ✨ Features

### 🎯 **Core Functionality**
- **Real APK Generation**: Creates actual Android APK files using Apache Cordova
- **Website Integration**: Convert any web URL into a mobile app
- **Custom Branding**: Upload custom icons, set app names, and configure appearance
- **Advanced Settings**: Configure permissions, orientations, and WebView options

### 🔐 **User System**
- **Firebase Authentication**: Google, GitHub, and email/password login
- **User Dashboard**: Personal project management and history
- **Protected Routes**: Secure user data and app generation

### 📱 **Mobile Features**
- **Download System**: Direct APK download links for mobile devices
- **Sharing**: Email integration and shareable download pages
- **Analytics**: Track downloads and app usage statistics

### 🎨 **Customization Options**
- **App Icons**: Upload and resize custom app icons
- **Splash Screens**: Configure loading screen appearance
- **Colors**: Set primary and secondary theme colors
- **Permissions**: Camera, storage, location, microphone access
- **Navigation**: Toggle navigation bar, back button, refresh controls
- **Orientation**: Portrait, landscape, or auto-rotate support

## 🛠️ Technology Stack

### **Frontend**
- **React.js 18.2.0** - Modern UI library
- **React Router** - Client-side navigation
- **Firebase SDK** - Authentication and user management
- **CSS3** - Custom styling with animations
- **Responsive Design** - Mobile and desktop optimized

### **Backend**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database for app storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### **Mobile Generation**
- **Apache Cordova** - Hybrid mobile app framework
- **Android SDK** - Official Android development tools
- **Gradle** - Build automation for Android
- **Java JDK** - Required for Android compilation

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Android SDK** (API level 33+)
- **Java JDK** (version 17)
- **Gradle** (version 8.0+)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/VenkatSatyaSaiABHISHEK/WEB-to-APK.git
cd WEB-to-APK
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Firebase**
- Create a Firebase project at https://console.firebase.google.com/
- Enable Authentication (Google, GitHub, Email/Password)
- Copy your Firebase config to `frontend/src/config/firebase.js`

5. **Set up Android SDK**
- Install Android Studio or Android SDK Command-line tools
- Set ANDROID_HOME environment variable
- Install required SDK platforms and build tools

## 🏃‍♂️ Running the Application

1. **Start the backend server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

2. **Start the frontend development server**
```bash
cd frontend
npm start
# Application opens at http://localhost:3000
```

## 📂 Project Structure

```
web-to-apk-platform/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── contexts/        # React context providers
│   │   ├── config/          # Firebase and API configuration
│   │   └── styles/          # CSS stylesheets
│   └── public/              # Static assets
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── RealAPKGenerator.js # APK generation logic
│   └── test-apk.html       # Testing interface
├── generated-apps/         # Generated APK files (gitignored)
├── uploads/               # User uploaded files (gitignored)
└── database.sqlite        # SQLite database (gitignored)
```

## 🎯 Usage

1. **Sign Up/Login**: Create an account or sign in with Google/GitHub
2. **Create App**: Enter website URL and app details
3. **Customize**: Upload icon, set colors, configure permissions
4. **Generate**: Click generate to create your APK
5. **Download**: Get your APK file or share download link
6. **Install**: Install the APK on Android devices

## 🔧 API Endpoints

- `POST /api/generate-app` - Generate new APK
- `GET /api/apps/:id` - Get app details
- `GET /api/download/:filename` - Download APK file
- `POST /api/share/:id` - Create shareable link
- `GET /api/user/:id/apps` - Get user's apps

## 🎨 Customization Features

### **App Icon Settings**
- Upload custom PNG/JPG icons
- Automatic resizing for different screen densities
- Preview before generation

### **Advanced Options**
- **WebView Configuration**: Hardware acceleration, JavaScript controls
- **Permissions**: Fine-grained Android permission control
- **Navigation**: Custom navigation bar and controls
- **Orientation**: Screen rotation preferences

## 🔒 Security Features

- **Firebase Authentication**: Secure user authentication
- **Protected API Routes**: User-specific data protection
- **File Upload Validation**: Secure file handling
- **CORS Configuration**: Proper cross-origin setup

## 🌟 Recent Updates

- ✅ **Real APK Generation**: Implemented actual Cordova-based APK building
- ✅ **Database System**: Complete SQLite integration with migrations
- ✅ **User Authentication**: Firebase Auth with multiple providers
- ✅ **Modern UI**: Clean, professional interface design
- ✅ **Mobile Sharing**: Download pages optimized for mobile devices
- ✅ **Server Monitoring**: Real-time status tracking
- ✅ **Build Fixes**: Resolved Gradle deprecation warnings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Abhishek Venkat Satyasai**
- GitHub: [@VenkatSatyaSaiABHISHEK](https://github.com/VenkatSatyaSaiABHISHEK)
- Email: chgroup22@gmail.com

## 🙏 Acknowledgments

- **Apache Cordova** - Mobile app framework
- **Firebase** - Authentication and hosting
- **React.js** - Frontend framework
- **Express.js** - Backend framework

---

⭐ **Star this repo if you found it helpful!** ⭐
```bash
cd ../frontend
npm install
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