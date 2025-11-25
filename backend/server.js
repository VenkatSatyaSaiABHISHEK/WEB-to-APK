const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const RealAPKGenerator = require('./RealAPKGenerator');
const APKGenerator = require('./APKGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize APK Generators
const apkGenerator = new RealAPKGenerator(path.join(__dirname, '..', 'generated-apps'));
const fakeApkGenerator = new APKGenerator(path.join(__dirname, '..', 'generated-apps'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    apk_path TEXT,
    share_link TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id)
  )`);
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// API Routes

// Generate APK from website URL
app.post('/api/generate-app', upload.single('icon'), async (req, res) => {
  try {
    const { name, url } = req.body;
    const appId = uuidv4();
    
    if (!name || !url) {
      return res.status(400).json({ error: 'App name and URL are required' });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const iconPath = req.file ? req.file.filename : null;
    const shareLink = `${req.protocol}://${req.get('host')}/download/${appId}`;
    
    // Generate REAL APK using Cordova with Java 17
    console.log(`🚀 Generating REAL APK for: ${name}`);
    const apkPath = await apkGenerator.generateRealAPK(appId, name, url, iconPath);
    
    // Get file size before saving to database
    const apkFilePath = path.join(__dirname, '..', 'generated-apps', apkPath);
    const fileSize = await getFileSize(apkFilePath);
    
    // Save to database
    db.run(
      `INSERT INTO apps (id, name, url, icon_path, apk_path, share_link) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appId, name, url, iconPath, apkPath, shareLink],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          success: true,
          message: 'Real Android APK generated successfully!',
          app: {
            id: appId,
            name,
            url,
            shareLink,
            downloadLink: `/api/download/${appId}`,
            apkSize: fileSize,
            installable: true,
            type: 'Real Android APK'
          }
        });
      }
    );
    
  } catch (error) {
    console.error('❌ APK Generation Error:', error.message);
    
    // Provide specific error messages
    let errorMessage = 'Failed to generate APK';
    if (error.message.includes('cordova')) {
      errorMessage = 'Android SDK not properly configured. Please install Android Studio and Cordova.';
    } else if (error.message.includes('ANDROID_SDK_ROOT')) {
      errorMessage = 'Android SDK path not found. Please set ANDROID_SDK_ROOT environment variable.';
    } else if (error.message.includes('gradle')) {
      errorMessage = 'Android build tools error. Please check Android SDK installation.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all apps for dashboard
app.get('/api/apps', (req, res) => {
  db.all(`SELECT * FROM apps ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Download APK file
app.get('/api/download/:id', (req, res) => {
  const appId = req.params.id;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  // Get app info
  db.get(`SELECT * FROM apps WHERE id = ?`, [appId], (err, app) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Record download
    db.run(
      `INSERT INTO downloads (app_id, ip_address, user_agent) VALUES (?, ?, ?)`,
      [appId, clientIP, userAgent]
    );
    
    // Increment download count
    db.run(`UPDATE apps SET download_count = download_count + 1 WHERE id = ?`, [appId]);
    
    // Serve APK file
    const apkFilePath = path.join(__dirname, '..', 'generated-apps', app.apk_path);
    
    if (fs.existsSync(apkFilePath)) {
      res.download(apkFilePath, `${app.name}.apk`);
    } else {
      res.status(404).json({ error: 'APK file not found' });
    }
  });
});

// Get app statistics
app.get('/api/stats/:id', (req, res) => {
  const appId = req.params.id;
  
  db.get(`SELECT * FROM apps WHERE id = ?`, [appId], (err, app) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Get download statistics
    db.all(
      `SELECT DATE(downloaded_at) as date, COUNT(*) as downloads 
       FROM downloads 
       WHERE app_id = ? 
       GROUP BY DATE(downloaded_at) 
       ORDER BY date DESC 
       LIMIT 30`,
      [appId],
      (err, downloadStats) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          app: app,
          totalDownloads: app.download_count,
          dailyStats: downloadStats
        });
      }
    );
  });
});

// Upload custom icon
app.post('/api/upload-icon', upload.single('icon'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve demo and test files
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'demo.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'test.html'));
});

app.get('/real-test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'real-apk-test.html'));
});

// Helper function to get file size
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  } catch (error) {
    return 'Unknown';
  }
}

// Simple APK creation function (placeholder)
async function createAPK(appId, appName, url, iconPath) {
  try {
    const apkDir = path.join(__dirname, '..', 'generated-apps');
    await fs.ensureDir(apkDir);
    
    // Create a basic Android project structure
    const projectDir = path.join(apkDir, appId);
    await fs.ensureDir(projectDir);
    
    // Create basic manifest and HTML wrapper
    const manifestContent = createAndroidManifest(appName, appId);
    await fs.writeFile(path.join(projectDir, 'AndroidManifest.xml'), manifestContent);
    
    // Create HTML wrapper that loads the website
    const htmlContent = createWebViewHTML(url);
    await fs.writeFile(path.join(projectDir, 'index.html'), htmlContent);
    
    // Create basic APK info file (in real implementation, you'd use Android build tools)
    const apkInfo = {
      id: appId,
      name: appName,
      url: url,
      created: new Date().toISOString()
    };
    
    const apkFileName = `${appId}.apk`;
    const apkInfoPath = path.join(projectDir, 'app-info.json');
    await fs.writeFile(apkInfoPath, JSON.stringify(apkInfo, null, 2));
    
    // Create a simple zip file as placeholder APK
    const archive = archiver('zip');
    const output = fs.createWriteStream(path.join(apkDir, apkFileName));
    
    return new Promise((resolve, reject) => {
      output.on('close', () => {
        resolve(apkFileName);
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      archive.directory(projectDir, false);
      archive.finalize();
    });
    
  } catch (error) {
    console.error('Error creating APK:', error);
    throw error;
  }
}

function createAndroidManifest(appName, packageName) {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.webtoapp.${packageName}"
    android:versionCode="1"
    android:versionName="1.0">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:label="${appName}"
        android:theme="@android:style/Theme.NoTitleBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
}

function createWebViewHTML(url) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web App</title>
    <style>
        body { margin: 0; padding: 0; }
        iframe { 
            width: 100vw; 
            height: 100vh; 
            border: none; 
        }
    </style>
</head>
<body>
    <script>
        // Redirect to the target website
        window.location.href = '${url}';
    </script>
    <iframe src="${url}" allowfullscreen></iframe>
</body>
</html>`;
}

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});