import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CleanModernAppGenerator() {
  const { user: currentUser, logout } = useAuth();
  const [sidebarOpen] = useState(false);
  const location = useLocation();
  
  // Form states
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [packageName, setPackageName] = useState('');
  const [appLogo, setAppLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [files, setFiles] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buildStage, setBuildStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const fileInputRef = useRef();
  const logoInputRef = useRef();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { 
          name: 'Home', 
          path: '/', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          )
        },
        { 
          name: 'Documentation', 
          path: '/docs', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          )
        }
      ]
    },
    {
      title: 'Build Tools',
      items: [
        { 
          name: 'APK Generator', 
          path: '/generate', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
            </svg>
          )
        },
        { 
          name: 'Project Builder', 
          path: '/builder', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          )
        }
      ]
    },
    {
      title: 'Management',
      items: [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
            </svg>
          )
        },
        { 
          name: 'My Projects', 
          path: '/projects', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
            </svg>
          )
        },
        { 
          name: 'Analytics', 
          path: '/analytics', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
            </svg>
          )
        }
      ]
    }
  ];

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setError('');
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAppLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Please select a valid image file for the logo');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!appName || !websiteUrl)) {
      setError('Please provide app name and website URL');
      return;
    }
    setCurrentStep(prev => prev + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const generateAPK = async () => {
    if (!appName || !websiteUrl) {
      setError('Please provide app name and website URL');
      return;
    }

    // Check if server is running first
    try {
      const healthCheck = await fetch('/api/health');
      if (!healthCheck.ok) {
        throw new Error('Server not responding');
      }
    } catch (error) {
      setError('Server is currently offline. Please contact chgroup22@gmail.com to report this issue. You can browse the website layout, but APK building is not available.');
      return;
    }

    setLoading(true);
    setShowAnimation(true);
    setError('');
    setProgress(0);
    
    const buildStages = [
      'Initializing build environment...',
      'Processing app configuration...',
      'Downloading website assets...',
      'Optimizing resources...',
      'Compiling Android project...',
      'Building APK package...',
      'Signing application...',
      'Finalizing build...'
    ];
    
    try {
      // Show progress updates while building
      let progressInterval;
      let currentStageIndex = 0;
      
      // Start progress animation
      progressInterval = setInterval(() => {
        if (currentStageIndex < buildStages.length - 1) {
          setBuildStage(buildStages[currentStageIndex]);
          setProgress(((currentStageIndex + 1) / buildStages.length) * 80); // Leave 20% for completion
          currentStageIndex++;
        }
      }, 3000);

      // Create form data for API request
      const formData = new FormData();
      formData.append('name', appName);
      formData.append('url', websiteUrl);
      formData.append('customization', JSON.stringify({
        description: appDescription,
        packageName: packageName
      }));
      
      if (currentUser) {
        formData.append('userId', currentUser.uid);
        formData.append('userEmail', currentUser.email);
      }
      
      if (appLogo) {
        formData.append('icon', appLogo);
      }
      
      if (files && files.length > 0) {
        formData.append('splashScreen', files[0]);
      }

      // Make actual API call to backend
      console.log('🚀 Calling real backend API to generate APK...');
      const response = await fetch('http://localhost:5000/api/generate-app', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ APK generation successful:', result);

      setProgress(100);
      setBuildStage('Build completed successfully!');
      
      // Show success result with real download link
      setTimeout(() => {
        setResult({
          downloadUrl: `http://localhost:5000${result.app.downloadLink}`,
          appName: result.app.name,
          packageName: result.app.id,
          size: result.app.apkSize || 'Unknown',
          buildTime: 'Just completed',
          success: true
        });
        setShowAnimation(false);
      }, 1000);

    } catch (error) {
      console.error('❌ APK Generation Error:', error);
      
      let errorMessage = 'Failed to generate APK. ';
      if (error.message.includes('Server error: 500')) {
        errorMessage += 'The build system encountered an error. This might be due to missing Android SDK tools.';
      } else if (error.message.includes('Network')) {
        errorMessage += 'Network connection error. Please check your internet connection.';
      } else if (error.message.includes('cordova')) {
        errorMessage += 'Android build tools are not properly configured on the server.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      setShowAnimation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <div className="logo-icon">A</div>
            <div className="logo-text">APK Builder</div>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <div className="nav-item-icon">{item.icon}</div>
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <div>
              <div className="page-title">APK Generator</div>
              <div className="breadcrumb">
                <span>Build Tools</span>
                <span className="breadcrumb-separator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                </span>
                <span>APK Generator</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="search-container">
              <div className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects, documentation..."
              />
            </div>
            
            {currentUser && (
              <div className="user-menu" onClick={handleLogout}>
                <div className="user-avatar">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {currentUser.displayName || 'User'}
                  </div>
                  <div className="user-email">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Loading Animation Overlay */}
        {showAnimation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              maxWidth: '500px',
              padding: '40px'
            }}>
              {/* App Preview */}
              <div style={{
                width: '120px',
                height: '120px',
                background: logoPreview || 'linear-gradient(135deg, #fff, #f0f0f0)',
                backgroundImage: logoPreview ? `url(${logoPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '48px',
                fontWeight: '700',
                color: logoPreview ? 'transparent' : '#667eea',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                animation: 'pulse 2s infinite'
              }}>
                {!logoPreview && appName.charAt(0).toUpperCase()}
              </div>
              
              {/* App Name */}
              <h1 style={{
                fontSize: '40px',
                marginBottom: '12px',
                textShadow: '0 3px 8px rgba(0, 0, 0, 0.4)'
              }}>
                {appName}
              </h1>
              
              <p style={{
                fontSize: '18px',
                opacity: 0.95,
                marginBottom: '40px'
              }}>
                Building your Android application...
              </p>
              
              {/* Progress */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{
                  fontSize: '20px',
                  marginBottom: '16px'
                }}>
                  {buildStage}
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.8))',
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: '8px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                
                <div style={{
                  fontSize: '16px',
                  opacity: 0.9,
                  fontFamily: 'monospace'
                }}>
                  {Math.round(progress)}% Complete
                </div>
              </div>
              
              {/* Animated Building Icons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                opacity: 0.7
              }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'white',
                      borderRadius: '50%',
                      animation: `bounce 1.5s infinite ${i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="main-content">
          {/* Step Progress Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
            padding: '24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {[
              { num: 1, title: 'App Details', desc: 'Basic information' },
              { num: 2, title: 'Customize', desc: 'Logo & styling' },
              { num: 3, title: 'Generate', desc: 'Build APK' }
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: currentStep >= step.num 
                      ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
                      : 'var(--gray-200)',
                    color: currentStep >= step.num ? 'white' : 'var(--gray-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: currentStep >= step.num ? 'var(--gray-900)' : 'var(--gray-500)'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--gray-500)'
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
                {index < 2 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: currentStep > step.num 
                      ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
                      : 'var(--gray-200)',
                    margin: '0 24px',
                    transition: 'all 0.3s ease'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '48px',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #000000, #374151)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Generate Android APK
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'var(--gray-600)',
              fontWeight: '500'
            }}>
              Convert your web project into a native Android application ready for distribution
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Main Form */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  {currentStep === 1 ? 'App Information' : 
                   currentStep === 2 ? 'Customization' : 'Generate APK'}
                </div>
                <div className="card-subtitle">
                  {currentStep === 1 ? 'Provide basic app details and source' :
                   currentStep === 2 ? 'Customize app appearance and branding' : 
                   'Review and build your Android application'}
                </div>
              </div>
              <div className="card-content">
                {error && (
                  <div className="alert alert-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13,13H11V7H13M11,15H13V17H11M15.73,3H8.27L3,8.27V15.73L8.27,21H15.73L21,15.73V8.27L15.73,3Z"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Step 1: Basic App Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '17px', fontWeight: '600' }}>Application Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="My Awesome App"
                        disabled={loading}
                        style={{ fontSize: '16px', padding: '16px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '17px', fontWeight: '600' }}>Website URL *</label>
                      <input
                        type="url"
                        className="form-input"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://your-website.com"
                        disabled={loading}
                        style={{ fontSize: '16px', padding: '16px' }}
                      />
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--gray-500)', 
                        marginTop: '8px',
                        lineHeight: '1.5'
                      }}>
                        The website that will be converted into an Android app
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '17px', fontWeight: '600' }}>App Description</label>
                      <textarea
                        className="form-input form-textarea"
                        value={appDescription}
                        onChange={(e) => setAppDescription(e.target.value)}
                        placeholder="Describe what your app does and its key features..."
                        disabled={loading}
                        style={{ fontSize: '16px', padding: '16px', minHeight: '100px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '17px', fontWeight: '600' }}>Package Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="com.yourcompany.appname"
                        disabled={loading}
                        style={{ fontSize: '16px', padding: '16px' }}
                      />
                      <p style={{ 
                        fontSize: '13px', 
                        color: 'var(--gray-500)', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        Unique identifier for your app (reverse domain notation)
                      </p>
                    </div>

                    <button
                      onClick={nextStep}
                      style={{
                        width: '100%',
                        padding: '18px',
                        background: (!appName || !websiteUrl) 
                          ? 'var(--gray-400)' 
                          : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '19px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-primary)',
                        cursor: (!appName || !websiteUrl) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease',
                        textTransform: 'none',
                        letterSpacing: '0.3px'
                      }}
                    >
                      Continue to Customization
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                      </svg>
                    </button>
                  </div>
                )}

                {/* Step 2: Customization */}
                {currentStep === 2 && (
                  <div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '17px', fontWeight: '600' }}>App Logo</label>
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        style={{
                          border: '2px dashed var(--gray-300)',
                          borderRadius: '16px',
                          padding: '32px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: logoPreview ? 'var(--gray-50)' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {logoPreview ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '12px'
                              }}
                            />
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-900)' }}>
                                Logo uploaded successfully
                              </p>
                              <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
                                Click to change logo
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{
                              width: '80px',
                              height: '80px',
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              borderRadius: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 16px',
                              color: 'white',
                              fontSize: '32px',
                              fontWeight: '700'
                            }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9,16.2L4.8,12L3.4,13.4L9,19L21,7L19.6,5.6L9,16.2Z"/>
                              </svg>
                            </div>
                            <p className="font-heading" style={{ fontSize: '17px', color: 'var(--gray-700)' }}>
                              Upload App Logo
                            </p>
                            <p className="font-body" style={{ fontSize: '15px', color: 'var(--gray-500)' }}>
                              PNG, JPG up to 2MB (recommended: 512x512px)
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoSelect}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '16px', fontWeight: '600' }}>Additional Files (Optional)</label>
                      <div
                        className={`upload-area ${files ? 'active' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ minHeight: '120px' }}
                      >
                        <div className="upload-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                        </div>
                        <div className="upload-title">
                          {files ? `${files.length} file(s) selected` : 'Upload additional resources'}
                        </div>
                        <div className="upload-subtitle">
                          Custom assets, configurations, etc.
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".zip,.html,.css,.js,.json,.png,.jpg,.jpeg"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={prevStep}
                        style={{
                          flex: 1,
                          padding: '18px',
                          background: 'white',
                          color: 'var(--gray-700)',
                          border: '2px solid var(--gray-300)',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        style={{
                          flex: 2,
                          padding: '18px',
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '18px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px'
                        }}
                      >
                        Continue to Build
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Generate APK */}
                {currentStep === 3 && (
                  <div>
                    <div style={{
                      background: 'var(--gray-50)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--gray-900)',
                        marginBottom: '16px'
                      }}>
                        Ready to Build
                      </h3>
                      <div style={{ fontSize: '16px', color: 'var(--gray-700)', lineHeight: '1.6' }}>
                        <p><strong>App Name:</strong> {appName}</p>
                        <p><strong>Website:</strong> {websiteUrl}</p>
                        <p><strong>Package:</strong> {packageName || 'com.example.app'}</p>
                        <p><strong>Logo:</strong> {appLogo ? '✓ Custom logo' : '✗ Default logo'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={prevStep}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: '18px',
                          background: 'white',
                          color: 'var(--gray-700)',
                          border: '2px solid var(--gray-300)',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.5 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={generateAPK}
                        disabled={loading}
                        style={{
                          flex: 2,
                          padding: '18px',
                          background: loading 
                            ? 'var(--gray-400)' 
                            : 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '18px',
                          fontWeight: '700',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transform: loading ? 'none' : 'translateY(0)',
                          boxShadow: loading ? 'none' : '0 4px 16px rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner"></div>
                            Building APK...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
                            </svg>
                            Generate APK
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div>
              {/* Preview Card */}
              <div className="content-card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                  <div className="card-title">App Preview</div>
                </div>
                <div className="card-content">
                  <div style={{
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'var(--gray-50)'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      borderRadius: 'var(--radius-xl)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: '700'
                    }}>
                      {appName ? appName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--gray-900)',
                      marginBottom: '4px'
                    }}>
                      {appName || 'Your App Name'}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--gray-500)',
                      fontFamily: 'monospace'
                    }}>
                      {packageName || 'com.example.app'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-title">Requirements</div>
                </div>
                <div className="card-content">
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px',
                        borderRadius: '50%',
                        background: appName ? 'var(--success)' : 'var(--gray-300)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                        </svg>
                      </div>
                      <span>App name is required</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px',
                        borderRadius: '50%',
                        background: (websiteUrl || files) ? 'var(--success)' : 'var(--gray-300)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                        </svg>
                      </div>
                      <span>Source files or URL needed</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                      </div>
                      <span>Mobile-responsive design recommended</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px',
                        borderRadius: '50%',
                        background: 'var(--warning)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                          <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                        </svg>
                      </div>
                      <span>Build time: 2-5 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="alert alert-success" style={{ 
              marginTop: '32px',
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--success), var(--accent))',
              color: 'white',
              border: 'none'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    APK Generated Successfully!
                  </h3>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    Your Android application is ready for download and installation.
                  </p>
                </div>
                <a
                  href={result.downloadUrl}
                  download
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: 'var(--success)',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                  </svg>
                  Download APK
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CleanModernAppGenerator;