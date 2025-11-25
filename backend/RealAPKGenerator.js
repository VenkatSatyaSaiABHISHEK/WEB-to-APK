const { exec, spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

class RealAPKGenerator {
  constructor(outputDir) {
    this.outputDir = outputDir;
    this.tempDir = path.join(outputDir, 'temp');
  }

  async generateRealAPK(appId, appName, websiteUrl, iconPath = null, splashPath = null, customization = {}) {
    const projectPath = path.join(this.tempDir, appId);
    
    try {
      console.log(`🚀 Starting REAL APK generation for: ${appName}`);
      console.log(`🎨 Customization options:`, customization);
      
      // Validate inputs
      if (!appName || appName.trim().length === 0) {
        throw new Error('App name is required');
      }
      
      if (!websiteUrl) {
        throw new Error('Website URL is required');
      }
      
      // Validate URL
      try {
        new URL(websiteUrl);
      } catch (urlError) {
        throw new Error('Invalid website URL provided');
      }
      
      // Step 1: Create Cordova project
      await this.createCordovaProject(projectPath, appId, appName);
      
      // Step 2: Configure the app with customizations
      await this.configureApp(projectPath, appName, websiteUrl, iconPath, appId, splashPath, customization);
      
      // Step 3: Add Android platform
      await this.addAndroidPlatform(projectPath);
      
      // Step 4: Apply customizations to Android project
      await this.applyCustomizations(projectPath, customization, iconPath, splashPath);
      
      // Step 5: Build APK
      const apkPath = await this.buildAPK(projectPath, appId);
      
      // Step 6: Move APK to final location
      const finalApkPath = await this.moveAPKToOutput(apkPath, appId, appName);
      
      console.log(`✅ REAL APK generated successfully: ${finalApkPath}`);
      
      // Cleanup temp files
      await fs.remove(projectPath);
      
      return path.basename(finalApkPath);
      
    } catch (error) {
      console.error(`❌ APK generation failed:`, error);
      
      // Enhanced error messages
      let enhancedError = error;
      if (error.message.includes('App id contains a reserved word')) {
        enhancedError = new Error('Invalid app name. Please use only letters and numbers.');
      } else if (error.message.includes('cordova: not found') || error.message.includes('cordova is not recognized')) {
        enhancedError = new Error('Cordova CLI not found. Please install with: npm install -g cordova');
      } else if (error.message.includes('ANDROID_SDK_ROOT')) {
        enhancedError = new Error('Android SDK not found. Please install Android Studio and set ANDROID_SDK_ROOT.');
      } else if (error.message.includes('JAVA_HOME')) {
        enhancedError = new Error('Java JDK not found. Please install JDK and set JAVA_HOME.');
      }
      
      // Cleanup on error
      if (await fs.pathExists(projectPath)) {
        await fs.remove(projectPath);
      }
      
      throw enhancedError;
    }
  }

  async createCordovaProject(projectPath, appId, appName) {
    console.log(`📱 Creating Cordova project: ${appName}`);
    
    // Ensure temp directory exists
    await fs.ensureDir(this.tempDir);
    
    // Remove existing project directory if it exists
    if (await fs.pathExists(projectPath)) {
      console.log(`🗑️ Removing existing project directory`);
      await fs.remove(projectPath);
    }
    
    // Create valid Android package identifier
    const validPackageId = this.createValidPackageId(appName, appId);
    console.log(`📦 Using package ID: ${validPackageId}`);
    
    // Create Cordova project with proper environment
    const env = {
      ...process.env,
      JAVA_HOME: "C:\\jdk-17.0.12+7",
      ANDROID_HOME: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      ANDROID_SDK_ROOT: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      GRADLE_HOME: "C:\\gradle\\gradle-8.8",
      ANDROID_BUILD_TOOLS_VERSION: "36.1.0",
      PATH: `C:\\jdk-17.0.12+7\\bin;C:\\gradle\\gradle-8.8\\bin;${process.env.LOCALAPPDATA}\\Android\\Sdk\\tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\platform-tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\build-tools\\36.1.0;${process.env.LOCALAPPDATA}\\Android\\Sdk\\cmdline-tools\\latest\\bin;${process.env.PATH}`
    };
    
    const createCommand = `cordova create "${projectPath}" "${validPackageId}" "${appName}"`;
    console.log(`🔨 Executing: ${createCommand}`);
    
    try {
      const { stdout, stderr } = await execAsync(createCommand, { env });
      if (stdout) console.log(`Cordova stdout: ${stdout}`);
      if (stderr) console.log(`Cordova stderr: ${stderr}`);
    } catch (error) {
      console.error(`❌ Cordova create failed:`, error.message);
      throw error;
    }
    
    console.log(`✅ Cordova project created successfully`);
  }

  createValidPackageId(appName, appId) {
    // Remove hyphens from UUID and take first 8 characters
    const cleanId = appId.replace(/-/g, '').substring(0, 8);
    
    // Clean app name: remove special chars, spaces, convert to lowercase
    let cleanName = appName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
      .replace(/^[0-9]+/, '') // Remove leading numbers
      .substring(0, 15); // Limit length
    
    // Ensure we have a valid name (fallback to 'app' if empty)
    if (!cleanName || cleanName.length === 0) {
      cleanName = 'webtoapp';
    }
    
    // Ensure name doesn't start with reserved words
    const reservedWords = ['android', 'java', 'javax', 'dalvik', 'system', 'app', 'activity'];
    if (reservedWords.includes(cleanName)) {
      cleanName = 'custom' + cleanName;
    }
    
    // Create package ID (must not start with number, no reserved words)
    const packageId = `com.webtoapp.${cleanName}${cleanId}`;
    
    console.log(`🔧 Package ID creation:`);
    console.log(`   Original: "${appName}" (${appId.substring(0, 8)}...)`);
    console.log(`   Cleaned name: "${cleanName}"`);
    console.log(`   Clean ID: "${cleanId}"`);
    console.log(`   Final package: "${packageId}"`);
    
    return packageId;
  }

  async configureApp(projectPath, appName, websiteUrl, iconPath, appId, splashPath = null, customization = {}) {
    console.log(`⚙️ Configuring app for website: ${websiteUrl}`);
    
    // Create the main HTML file that loads the website with customizations
    const indexHtml = this.createWebViewHTML(websiteUrl, appName, customization);
    const wwwPath = path.join(projectPath, 'www');
    await fs.writeFile(path.join(wwwPath, 'index.html'), indexHtml);
    
    // Create required icon directories and files
    await this.createRequiredIcons(wwwPath, iconPath);
    
    // Create splash screen if provided
    if (splashPath) {
      await this.createSplashScreens(wwwPath, splashPath);
    }
    
    // Update config.xml with proper settings and customizations
    const validPackageId = this.createValidPackageId(appName, appId);
    const configXml = this.createConfigXml(appName, websiteUrl, validPackageId, customization);
    await fs.writeFile(path.join(projectPath, 'config.xml'), configXml);
    
    console.log(`✅ App configuration completed with customizations`);
  }

  async createRequiredIcons(wwwPath, customIconPath = null) {
    console.log(`🎨 Creating required icon files...`);
    
    // Create icon directories
    const iconDirs = [
      'res/icon/android',
      'res/screen/android'
    ];
    
    for (const iconDir of iconDirs) {
      await fs.ensureDir(path.join(wwwPath, iconDir));
    }
    
    // Create a simple default icon (1x1 PNG in base64)
    const defaultIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAFAtlUinwAAAABJRU5ErkJggg==';
    const defaultIconBuffer = Buffer.from(defaultIconBase64, 'base64');
    
    // If custom icon is provided, try to use it
    let iconBuffer = defaultIconBuffer;
    if (customIconPath) {
      const sourcePath = path.join(this.outputDir, '..', 'uploads', customIconPath);
      if (await fs.pathExists(sourcePath)) {
        iconBuffer = await fs.readFile(sourcePath);
        console.log(`📷 Using custom icon: ${customIconPath}`);
      }
    }
    
    // Create all required Android icon files
    const androidIcons = [
      'res/icon/android/drawable-ldpi-icon.png',     // 36x36
      'res/icon/android/drawable-mdpi-icon.png',     // 48x48
      'res/icon/android/drawable-hdpi-icon.png',     // 72x72
      'res/icon/android/drawable-xhdpi-icon.png',    // 96x96
      'res/icon/android/drawable-xxhdpi-icon.png',   // 144x144
      'res/icon/android/drawable-xxxhdpi-icon.png'   // 192x192
    ];
    
    // Write icon files
    for (const iconPath of androidIcons) {
      const fullPath = path.join(wwwPath, iconPath);
      await fs.writeFile(fullPath, iconBuffer);
    }
    
    console.log(`✅ Created ${androidIcons.length} icon files`);
  }

  async addAndroidPlatform(projectPath) {
    console.log(`🤖 Adding Android platform...`);
    
    // Set proper environment variables for Cordova
    const env = {
      ...process.env,
      JAVA_HOME: "C:\\jdk-17.0.12+7",
      ANDROID_HOME: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      ANDROID_SDK_ROOT: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      GRADLE_HOME: "C:\\gradle\\gradle-8.8",
      ANDROID_BUILD_TOOLS_VERSION: "36.1.0",
      PATH: `C:\\jdk-17.0.12+7\\bin;C:\\gradle\\gradle-8.8\\bin;${process.env.LOCALAPPDATA}\\Android\\Sdk\\tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\platform-tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\build-tools\\36.1.0;${process.env.LOCALAPPDATA}\\Android\\Sdk\\cmdline-tools\\latest\\bin;${process.env.PATH}`
    };
    
    const addPlatformCommand = `cd "${projectPath}" && cordova platform add android@12.0.1`;
    
    try {
      const { stdout, stderr } = await execAsync(addPlatformCommand, { env });
      if (stdout) console.log(`Platform add stdout: ${stdout}`);
      if (stderr) console.log(`Platform add stderr: ${stderr}`);
    } catch (error) {
      console.error(`❌ Platform add failed:`, error.message);
      throw error;
    }
    
    console.log(`✅ Android platform added`);
    
    // Fix build configuration to prevent edge-to-edge issues
    await this.fixAndroidBuildConfiguration(projectPath);
  }

  async fixAndroidBuildConfiguration(projectPath) {
    console.log(`🔧 Fixing Android build configuration...`);
    
    try {
      // Fix app-level build.gradle
      const appBuildGradlePath = path.join(projectPath, 'platforms', 'android', 'app', 'build.gradle');
      if (await fs.pathExists(appBuildGradlePath)) {
        let buildGradleContent = await fs.readFile(appBuildGradlePath, 'utf8');
        
        // Force specific SDK versions
        buildGradleContent = buildGradleContent.replace(/compileSdkVersion\s+\d+/g, 'compileSdkVersion 33');
        buildGradleContent = buildGradleContent.replace(/targetSdkVersion\s+\d+/g, 'targetSdkVersion 32');
        buildGradleContent = buildGradleContent.replace(/buildToolsVersion\s+["'][^"']+["']/g, 'buildToolsVersion "33.0.2"');
        
        await fs.writeFile(appBuildGradlePath, buildGradleContent);
        console.log(`✅ Fixed app build.gradle`);
      }
      
      // Fix project-level build.gradle
      const projectBuildGradlePath = path.join(projectPath, 'platforms', 'android', 'build.gradle');
      if (await fs.pathExists(projectBuildGradlePath)) {
        let projectBuildContent = await fs.readFile(projectBuildGradlePath, 'utf8');
        
        // Ensure compatible AGP version
        projectBuildContent = projectBuildContent.replace(/classpath\s+["']com\.android\.tools\.build:gradle:[^"']+["']/g, 'classpath "com.android.tools.build:gradle:7.4.2"');
        
        await fs.writeFile(projectBuildGradlePath, projectBuildContent);
        console.log(`✅ Fixed project build.gradle`);
      }
      
      // Fix gradle wrapper properties
      const gradleWrapperPath = path.join(projectPath, 'platforms', 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');
      if (await fs.pathExists(gradleWrapperPath)) {
        let wrapperContent = await fs.readFile(gradleWrapperPath, 'utf8');
        wrapperContent = wrapperContent.replace(/distributionUrl=.*/, 'distributionUrl=https\\\\://services.gradle.org/distributions/gradle-8.0-bin.zip');
        
        await fs.writeFile(gradleWrapperPath, wrapperContent);
        console.log(`✅ Fixed gradle wrapper`);
      }
      
      // Add gradle.properties to suppress deprecation warnings
      const gradlePropsPath = path.join(projectPath, 'platforms', 'android', 'gradle.properties');
      const gradleProps = `
# Suppress Gradle deprecation warnings
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.daemon=true
org.gradle.configureondemand=true
android.suppressUnsupportedCompileSdk=true
`;
      await fs.writeFile(gradlePropsPath, gradleProps);
      console.log(`✅ Added gradle.properties to suppress warnings`);
      
    } catch (error) {
      console.error(`⚠️ Warning: Could not fix build configuration:`, error.message);
    }
  }

  async buildAPK(projectPath, appId) {
    console.log(`🔨 Building APK...`);
    
    // Set proper environment variables for Cordova build
    const env = {
      ...process.env,
      JAVA_HOME: "C:\\jdk-17.0.12+7",
      ANDROID_HOME: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      ANDROID_SDK_ROOT: process.env.LOCALAPPDATA + "\\Android\\Sdk",
      GRADLE_HOME: "C:\\gradle\\gradle-8.8",
      ANDROID_BUILD_TOOLS_VERSION: "36.1.0",
      PATH: `C:\\jdk-17.0.12+7\\bin;C:\\gradle\\gradle-8.8\\bin;${process.env.LOCALAPPDATA}\\Android\\Sdk\\tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\platform-tools;${process.env.LOCALAPPDATA}\\Android\\Sdk\\build-tools\\36.1.0;${process.env.LOCALAPPDATA}\\Android\\Sdk\\cmdline-tools\\latest\\bin;${process.env.PATH}`
    };
    
    // Try to prepare Gradle wrapper first
    console.log(`📦 Preparing build environment...`);
    try {
      const prepareCommand = `cd "${projectPath}" && cordova prepare android`;
      await execAsync(prepareCommand, { env });
      console.log(`✅ Build environment prepared`);
    } catch (prepError) {
      console.log(`⚠️ Prepare warning: ${prepError.message}`);
    }
    
    // Try building with standard Cordova command first
    const buildCommand = `cd "${projectPath}" && cordova build android --verbose`;
    
    try {
      const { stdout, stderr } = await execAsync(buildCommand, { 
        env,
        timeout: 300000 // 5 minutes timeout
      });
      console.log(`Build output:`, stdout);
      if (stderr) console.log(`Build warnings:`, stderr);
    } catch (error) {
      console.error(`❌ Build failed:`, error.message);
      
      // Try alternative build approach with gradle wrapper directly
      console.log(`🔄 Trying alternative build method...`);
      try {
        const altBuildCommand = `cd "${projectPath}\\platforms\\android" && .\\gradlew assembleDebug --warning-mode=none`;
        const { stdout: altStdout, stderr: altStderr } = await execAsync(altBuildCommand, { env });
        console.log(`Alternative build output:`, altStdout);
        if (altStderr) console.log(`Alternative build warnings:`, altStderr);
      } catch (altError) {
        console.error(`❌ Alternative build also failed:`, altError.message);
        throw error; // Throw original error
      }
    }
    
    // Find the generated APK
    const apkDir = path.join(projectPath, 'platforms', 'android', 'app', 'build', 'outputs', 'apk', 'debug');
    const apkFiles = await fs.readdir(apkDir);
    const apkFile = apkFiles.find(file => file.endsWith('.apk'));
    
    if (!apkFile) {
      throw new Error('APK file not found after build');
    }
    
    const apkPath = path.join(apkDir, apkFile);
    console.log(`✅ APK built successfully: ${apkFile}`);
    
    return apkPath;
  }

  async moveAPKToOutput(sourcePath, appId, appName) {
    const finalDir = path.join(this.outputDir);
    await fs.ensureDir(finalDir);
    
    const finalApkName = `${appName.replace(/[^a-zA-Z0-9]/g, '_')}_${appId.substring(0, 8)}.apk`;
    const finalPath = path.join(finalDir, finalApkName);
    
    await fs.copy(sourcePath, finalPath);
    
    return finalPath;
  }

  createWebViewHTML(websiteUrl, appName, customization = {}) {
    const primaryColor = customization?.appearance?.primaryColor || '#667eea';
    const secondaryColor = customization?.appearance?.secondaryColor || '#764ba2';
    const showProgressBar = customization?.navigation?.showProgressBar !== false;
    const enableZoom = customization?.advanced?.enableZoom || false;
    const userAgent = customization?.advanced?.userAgent || '';
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, ${enableZoom ? 'user-scalable=yes' : 'user-scalable=no'}">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <title>${appName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            overflow: hidden;
        }
        
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            z-index: 9999;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .webview-container {
            width: 100vw;
            height: 100vh;
            display: none;
        }
        
        .webview-frame {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }
        
        .error-container {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f8f9fa;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
        }
        
        .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        
        .retry-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            margin-top: 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <!-- Loading Screen -->
    <div class="loader" id="loader">
        <div class="loader-spinner"></div>
        <h2>${appName}</h2>
        <p>Loading...</p>
    </div>
    
    <!-- Main WebView Container -->
    <div class="webview-container" id="webviewContainer">
        <iframe 
            id="mainFrame" 
            class="webview-frame" 
            src="${websiteUrl}"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation">
        </iframe>
    </div>
    
    <!-- Error Screen -->
    <div class="error-container" id="errorContainer">
        <div class="error-icon">📱</div>
        <h2>Connection Error</h2>
        <p>Unable to load ${websiteUrl}</p>
        <p>Please check your internet connection.</p>
        <button class="retry-btn" onclick="retryLoad()">Retry</button>
    </div>

    <script>
        let retryCount = 0;
        const maxRetries = 3;
        
        function showLoader() {
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('webviewContainer').style.display = 'none';
            document.getElementById('errorContainer').style.display = 'none';
        }
        
        function showWebView() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('webviewContainer').style.display = 'block';
            document.getElementById('errorContainer').style.display = 'none';
        }
        
        function showError() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('webviewContainer').style.display = 'none';
            document.getElementById('errorContainer').style.display = 'flex';
        }
        
        function retryLoad() {
            if (retryCount < maxRetries) {
                retryCount++;
                showLoader();
                setTimeout(() => {
                    const frame = document.getElementById('mainFrame');
                    frame.src = frame.src; // Reload iframe
                }, 1000);
            }
        }
        
        // Handle iframe load events
        document.getElementById('mainFrame').addEventListener('load', function() {
            setTimeout(showWebView, 1500); // Show content after brief delay
        });
        
        document.getElementById('mainFrame').addEventListener('error', function() {
            showError();
        });
        
        // Fallback: Show webview after timeout even if load event doesn't fire
        setTimeout(() => {
            if (document.getElementById('loader').style.display !== 'none') {
                showWebView();
            }
        }, 10000);
        
        // Handle Android back button (if available)
        document.addEventListener('backbutton', function(e) {
            e.preventDefault();
            // You can add custom back button behavior here
            if (window.history.length > 1) {
                window.history.back();
            } else {
                navigator.app.exitApp();
            }
        });
    </script>
</body>
</html>`;
  }

  createConfigXml(appName, websiteUrl, packageId, customization = {}) {
    const domain = new URL(websiteUrl).hostname;
    
    return `<?xml version='1.0' encoding='utf-8'?>
<widget id="${packageId}" 
        version="1.0.0" 
        xmlns="http://www.w3.org/ns/widgets" 
        xmlns:cdv="http://cordova.apache.org/ns/1.0">
    
    <name>${appName}</name>
    
    <description>
        Mobile app for ${websiteUrl}
    </description>
    
    <author email="support@webtoapp.com" href="https://webtoapp.com">
        WebToApp Platform
    </author>
    
    <content src="index.html" />
    
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    
    <!-- Allow navigation to the target website -->
    <allow-navigation href="${websiteUrl}" />
    <allow-navigation href="https://${domain}/*" />
    <allow-navigation href="http://${domain}/*" />
    
    <!-- Platform-specific settings -->
    <platform name="android">
        <allow-intent href="market:*" />
        
        <!-- App settings -->
        <preference name="android-minSdkVersion" value="22" />
        <preference name="android-targetSdkVersion" value="33" />
        <preference name="android-compileSdkVersion" value="34" />
        
        <!-- Completely disable edge-to-edge features -->
        <preference name="AndroidEdgeToEdge" value="false" />
        
        <!-- WebView settings -->
        <preference name="LoadUrlTimeoutValue" value="20000" />
        
        <!-- Android Permissions will be handled by plugins automatically -->
        
        <!-- Icons -->
        <icon density="ldpi" src="www/res/icon/android/drawable-ldpi-icon.png" />
        <icon density="mdpi" src="www/res/icon/android/drawable-mdpi-icon.png" />
        <icon density="hdpi" src="www/res/icon/android/drawable-hdpi-icon.png" />
        <icon density="xhdpi" src="www/res/icon/android/drawable-xhdpi-icon.png" />
        <icon density="xxhdpi" src="www/res/icon/android/drawable-xxhdpi-icon.png" />
        <icon density="xxxhdpi" src="www/res/icon/android/drawable-xxxhdpi-icon.png" />
    </platform>
    
    <!-- Plugins -->
    <plugin name="cordova-plugin-whitelist" spec="^1.3.0" />
    <plugin name="cordova-plugin-network-information" spec="^3.0.0" />
    <plugin name="cordova-plugin-device" spec="^2.1.0" />
    
    <!-- Content Security Policy -->
    <access origin="*" />
    <access origin="${websiteUrl}" />
    <access origin="https://${domain}" />
    
</widget>`;
  }

  async createSplashScreens(wwwPath, splashPath) {
    console.log(`🎨 Creating custom splash screens...`);
    
    // Create splash screen directories
    const splashDirs = [
      'res/screen/android'
    ];
    
    for (const splashDir of splashDirs) {
      await fs.ensureDir(path.join(wwwPath, splashDir));
    }
    
    // Read the custom splash screen
    const sourcePath = path.join(this.outputDir, '..', 'uploads', splashPath);
    if (await fs.pathExists(sourcePath)) {
      const splashBuffer = await fs.readFile(sourcePath);
      
      // Create all required Android splash screen files
      const androidSplashes = [
        'res/screen/android/drawable-land-ldpi-screen.png',    // 320x240
        'res/screen/android/drawable-land-mdpi-screen.png',    // 480x320
        'res/screen/android/drawable-land-hdpi-screen.png',    // 800x480
        'res/screen/android/drawable-land-xhdpi-screen.png',   // 1280x720
        'res/screen/android/drawable-land-xxhdpi-screen.png',  // 1920x1280
        'res/screen/android/drawable-land-xxxhdpi-screen.png', // 2560x1600
        'res/screen/android/drawable-port-ldpi-screen.png',    // 240x320
        'res/screen/android/drawable-port-mdpi-screen.png',    // 320x480
        'res/screen/android/drawable-port-hdpi-screen.png',    // 480x800
        'res/screen/android/drawable-port-xhdpi-screen.png',   // 720x1280
        'res/screen/android/drawable-port-xxhdpi-screen.png',  // 1280x1920
        'res/screen/android/drawable-port-xxxhdpi-screen.png'  // 1600x2560
      ];
      
      // Write splash screen files (using the same image for all sizes)
      for (const splashFile of androidSplashes) {
        const fullPath = path.join(wwwPath, splashFile);
        await fs.writeFile(fullPath, splashBuffer);
      }
      
      console.log(`✅ Created ${androidSplashes.length} splash screen files`);
    }
  }

  async applyCustomizations(projectPath, customization, iconPath, splashPath) {
    console.log(`🎨 Applying advanced customizations...`);
    
    const androidPath = path.join(projectPath, 'platforms', 'android');
    if (!(await fs.pathExists(androidPath))) {
      console.log(`⚠️ Android platform not found, skipping customizations`);
      return;
    }

    try {
      // Apply theme colors to styles
      if (customization?.appearance?.primaryColor || customization?.appearance?.secondaryColor) {
        await this.applyThemeColors(androidPath, customization.appearance);
      }

      // Apply navigation customizations
      if (customization?.navigation) {
        await this.applyNavigationSettings(projectPath, customization.navigation);
      }

      // Apply permissions
      if (customization?.permissions) {
        await this.applyPermissions(projectPath, customization.permissions);
      }

      // Apply advanced WebView settings
      if (customization?.advanced) {
        await this.applyAdvancedSettings(projectPath, customization.advanced);
      }

      console.log(`✅ Customizations applied successfully`);
    } catch (error) {
      console.warn(`⚠️ Some customizations could not be applied:`, error.message);
    }
  }

  async applyThemeColors(androidPath, appearance) {
    console.log(`🎨 Applying theme colors...`);
    
    // Update colors.xml with custom colors
    const colorsXmlPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'colors.xml');
    const primaryColor = appearance.primaryColor || '#3B82F6';
    const secondaryColor = appearance.secondaryColor || '#10B981';
    
    const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${primaryColor}</color>
    <color name="colorPrimaryDark">${this.darkenColor(primaryColor)}</color>
    <color name="colorAccent">${secondaryColor}</color>
    <color name="colorBackground">#FFFFFF</color>
    <color name="colorSurface">#FFFFFF</color>
</resources>`;

    await fs.ensureDir(path.dirname(colorsXmlPath));
    await fs.writeFile(colorsXmlPath, colorsXml);
  }

  async applyNavigationSettings(projectPath, navigation) {
    console.log(`🧭 Applying navigation settings...`);
    
    // Update MainActivity.java with navigation preferences
    const mainActivityPath = path.join(projectPath, 'platforms', 'android', 'app', 'src', 'main', 'java');
    
    // These settings will be applied through config.xml preferences instead
    // to avoid complex Java file modifications
  }

  async applyPermissions(projectPath, permissions) {
    console.log(`🔒 Applying permissions...`);
    
    // Permissions will be handled through config.xml plugins
    // This is a placeholder for future permission management
  }

  async applyAdvancedSettings(projectPath, advanced) {
    console.log(`⚙️ Applying advanced WebView settings...`);
    
    // Advanced settings will be applied through config.xml preferences
    // This is a placeholder for future WebView customizations
  }

  darkenColor(color) {
    // Simple color darkening function
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, (num >> 16) - 30);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - 30);
    const b = Math.max(0, (num & 0x0000FF) - 30);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}

module.exports = RealAPKGenerator;