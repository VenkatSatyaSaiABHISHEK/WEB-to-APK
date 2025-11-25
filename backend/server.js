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

// Middleware - Configure CORS for Vercel deployment
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://fronend-glvctfm4q-venkatsatyasaiabhisheks-projects.vercel.app', // Old Vercel deployment
    'https://fronend-9k9mrkp3z-venkatsatyasaiabhisheks-projects.vercel.app', // New Vercel deployment
    'https://*.vercel.app', // Any Vercel domain
    'https://aerographic-traci-preprudent.ngrok-free.dev' // ngrok tunnel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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
    splash_path TEXT,
    customization TEXT,
    user_id TEXT,
    user_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    apk_path TEXT,
    share_link TEXT
  )`);
  
  // Add missing columns if they don't exist (for existing databases)
  db.run(`ALTER TABLE apps ADD COLUMN splash_path TEXT`, () => {
    console.log('Added splash_path column (or already exists)');
  });
  
  db.run(`ALTER TABLE apps ADD COLUMN apk_path TEXT`, () => {
    console.log('Added apk_path column (or already exists)');
  });
  
  db.run(`ALTER TABLE apps ADD COLUMN share_link TEXT`, () => {
    console.log('Added share_link column (or already exists)');
  });
  
  db.run(`ALTER TABLE apps ADD COLUMN customization TEXT`, () => {
    console.log('Added customization column (or already exists)');
  });
  
  db.run(`ALTER TABLE apps ADD COLUMN user_id TEXT`, () => {
    console.log('Added user_id column (or already exists)');
  });
  
  db.run(`ALTER TABLE apps ADD COLUMN user_email TEXT`, () => {
    console.log('Added user_email column (or already exists)');
  });
  
  db.run(`CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    apps_generated INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    plan_type TEXT DEFAULT 'free'
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

// Configure multer for multiple files
const multiUpload = upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'splashScreen', maxCount: 1 }
]);

// API Routes

// Generate APK from website URL
app.post('/api/generate-app', multiUpload, async (req, res) => {
  try {
    const { name, url, customization, userId, userEmail } = req.body;
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
    
    const iconPath = req.files?.icon?.[0]?.filename || null;
    const splashPath = req.files?.splashScreen?.[0]?.filename || null;
    const shareLink = `${req.protocol}://${req.get('host')}/download/${appId}`;
    
    // Parse customization settings
    let customizationData = {};
    try {
      customizationData = customization ? JSON.parse(customization) : {};
    } catch (error) {
      console.warn('Invalid customization data:', error);
    }
    
    // Generate REAL APK using Cordova with customization
    console.log(`🚀 Generating REAL APK for: ${name}`);
    console.log(`📱 Customization:`, customizationData);
    const apkPath = await apkGenerator.generateRealAPK(appId, name, url, iconPath, splashPath, customizationData);
    
    // Get file size before saving to database
    const apkFilePath = path.join(__dirname, '..', 'generated-apps', apkPath);
    const fileSize = await getFileSize(apkFilePath);
    
    // Update user statistics if user is authenticated
    if (userId) {
      db.run(
        `INSERT OR REPLACE INTO users (id, email, apps_generated, total_downloads) 
         VALUES (?, ?, COALESCE((SELECT apps_generated FROM users WHERE id = ?), 0) + 1, 
                 COALESCE((SELECT total_downloads FROM users WHERE id = ?), 0))`,
        [userId, userEmail, userId, userId]
      );
    }
    
    // Save to database with new fields
    db.run(
      `INSERT INTO apps (id, name, url, icon_path, splash_path, customization, user_id, user_email, apk_path, share_link) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [appId, name, url, iconPath, splashPath, JSON.stringify(customizationData), userId, userEmail, apkPath, shareLink],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          success: true,
          message: 'Real Android APK generated successfully with customizations!',
          app: {
            id: appId,
            name,
            url,
            shareLink,
            downloadLink: `/api/download/${appId}`,
            apkSize: fileSize,
            installable: true,
            type: 'Real Android APK',
            customized: true,
            features: {
              customColors: customizationData?.appearance?.primaryColor ? true : false,
              customSplash: splashPath ? true : false,
              customIcon: iconPath ? true : false,
              customNavigation: customizationData?.navigation ? true : false
            }
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

// Get user-specific apps
app.get('/api/user/:userId/apps', (req, res) => {
  const userId = req.params.userId;
  
  db.all(
    `SELECT * FROM apps WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    (err, apps) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json(apps);
    }
  );
});

// Get user statistics
app.get('/api/user/:userId/stats', (req, res) => {
  const userId = req.params.userId;
  
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get app count and total downloads for this user
    db.all(
      `SELECT COUNT(*) as appCount, SUM(download_count) as totalDownloads FROM apps WHERE user_id = ?`,
      [userId],
      (err, stats) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          user: user || { id: userId, apps_generated: 0, total_downloads: 0 },
          stats: stats[0] || { appCount: 0, totalDownloads: 0 }
        });
      }
    );
  });
});

// Update user profile
app.put('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const { displayName, email, photoUrl } = req.body;
  
  db.run(
    `INSERT OR REPLACE INTO users (id, email, display_name, photo_url) VALUES (?, ?, ?, ?)`,
    [userId, email, displayName, photoUrl],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ success: true, message: 'User profile updated' });
    }
  );
});

// Share APK via email
app.post('/api/share/:id', (req, res) => {
  const appId = req.params.id;
  const { email, message } = req.body;
  
  db.get(`SELECT * FROM apps WHERE id = ?`, [appId], (err, app) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Create shareable link
    const shareableLink = `${req.protocol}://${req.get('host')}/download/${appId}`;
    const downloadLink = `${req.protocol}://${req.get('host')}/api/download/${appId}`;
    
    // In a real implementation, you would send an actual email here
    // For now, we'll return the sharing information
    res.json({
      success: true,
      message: 'Share link generated successfully',
      shareData: {
        appName: app.name,
        downloadLink: downloadLink,
        shareableLink: shareableLink,
        recipientEmail: email,
        customMessage: message,
        emailSubject: `Download ${app.name} - Android APK`,
        emailBody: `Hi!

${message || 'I wanted to share this Android app with you.'}

App: ${app.name}
Website: ${app.url}

📱 Download APK: ${downloadLink}
🔗 Share Page: ${shareableLink}

Install the APK on your Android device to use this app.

Best regards!`
      }
    });
  });
});

// Get shareable link for app
app.get('/api/share/:id', (req, res) => {
  const appId = req.params.id;
  
  db.get(`SELECT * FROM apps WHERE id = ?`, [appId], (err, app) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    const shareableLink = `${req.protocol}://${req.get('host')}/download/${appId}`;
    const downloadLink = `${req.protocol}://${req.get('host')}/api/download/${appId}`;
    
    res.json({
      success: true,
      app: {
        id: app.id,
        name: app.name,
        url: app.url,
        downloadLink: downloadLink,
        shareableLink: shareableLink,
        downloadCount: app.download_count,
        createdAt: app.created_at
      }
    });
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

// Shareable download page
app.get('/download/:id', (req, res) => {
  const appId = req.params.id;
  
  db.get(`SELECT * FROM apps WHERE id = ?`, [appId], (err, app) => {
    if (err || !app) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>App Not Found</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">📱 App Not Found</h1>
          <p>The requested APK download link is not valid or has expired.</p>
          <a href="/">← Go to APK Builder</a>
        </body>
        </html>
      `);
    }
    
    const downloadLink = `/api/download/${appId}`;
    const apkSize = app.apk_size || 'Unknown';
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Download ${app.name} - APK</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            color: #333;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .app-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 32px;
            font-weight: bold;
            color: white;
          }
          .download-btn {
            background: #22c55e;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin: 20px 0;
            transition: all 0.2s;
          }
          .download-btn:hover {
            background: #16a34a;
            transform: translateY(-2px);
          }
          .info {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #6b7280;
          }
          .share-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            margin: 0 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="app-icon">
            ${app.name.charAt(0).toUpperCase()}
          </div>
          <h1>${app.name}</h1>
          <p>Android APK Application</p>
          
          <a href="${downloadLink}" class="download-btn">
            📱 Download APK
          </a>
          
          <div class="info">
            <strong>Website:</strong> ${app.url}<br>
            <strong>Downloads:</strong> ${app.download_count || 0}<br>
            <strong>Created:</strong> ${new Date(app.created_at).toLocaleDateString()}
          </div>
          
          <div>
            <button class="share-btn" onclick="shareApp()">📤 Share</button>
            <button class="share-btn" onclick="copyLink()">📋 Copy Link</button>
          </div>
          
          <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
            ⚠️ Enable "Unknown Sources" in Android settings to install APK files
          </p>
        </div>
        
        <script>
          function shareApp() {
            if (navigator.share) {
              navigator.share({
                title: '${app.name} - Android APK',
                text: 'Download this Android app: ${app.name}',
                url: window.location.href
              });
            } else {
              copyLink();
            }
          }
          
          function copyLink() {
            navigator.clipboard.writeText(window.location.href);
            alert('Share link copied to clipboard!');
          }
        </script>
      </body>
      </html>
    `);
  });
});

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

// Root route for ngrok verification
app.get('/', (req, res) => {
  res.json({ 
    message: 'Web-to-APK Backend Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      generateApp: '/api/generate-app',
      apps: '/api/apps',
      download: '/api/download/:id'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});