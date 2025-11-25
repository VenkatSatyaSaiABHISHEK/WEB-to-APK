import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthDebug from '../components/AuthDebug';

function CleanModernHome() {
  const { user: currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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

  return (
    <div className="app-container">
      {/* Sidebar - Only show for logged in users */}
      {currentUser && (
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
      )}

      {/* Main Content Wrapper */}
      <div className={currentUser ? "main-wrapper" : "main-wrapper-full"}>
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
            <div>
              <div className="page-title">{currentUser ? 'Dashboard' : 'APK Builder Platform'}</div>
              {currentUser && (
                <div className="breadcrumb">
                  <span>Home</span>
                  <span className="breadcrumb-separator">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                    </svg>
                  </span>
                  <span>Overview</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="header-right">

            
            {currentUser ? (
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
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link 
                  to="/login" 
                  style={{
                    padding: '10px 20px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <section style={{
            padding: currentUser ? '80px 40px 120px' : '120px 40px 160px',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                marginBottom: '32px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#22c55e',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Production Ready Platform</span>
              </div>
              
              <h1 style={{
                fontSize: currentUser ? '56px' : '72px',
                marginBottom: '24px',
                fontWeight: '900'
              }}>
                Transform Websites into{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Mobile Apps
                </span>
              </h1>
              
              <p style={{
                fontSize: '20px',
                marginBottom: '48px',
                maxWidth: '600px',
                margin: '0 auto 48px',
                opacity: 0.9,
                lineHeight: '1.6'
              }}>
                Professional APK generation platform trusted by developers worldwide. 
                Convert any web project into a native Android application in minutes.
              </p>
              
              {!currentUser && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Link
                    to="/signup"
                    style={{
                      padding: '16px 32px',
                      background: '#22c55e',
                      color: 'white',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Start Building
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      padding: '16px 32px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              )}
              
              {currentUser && (
                <Link
                  to="/generate"
                  style={{
                    padding: '16px 32px',
                    background: '#22c55e',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
                  </svg>
                  Generate APK
                </Link>
              )}
            </div>
          </section>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Apps Generated</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5,200+</div>
              <div className="stat-label">Active Developers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.8%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>

          {/* Dashboard Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <Link to="/generate" style={{
              padding: '32px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: 'none'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Create New APK</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Generate mobile app from web project</p>
            </Link>
            
            <Link to="/dashboard" style={{
              padding: '32px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '16px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: '#f3f4f6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Analytics Dashboard</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>View build statistics and metrics</p>
            </Link>
            
            <Link to="/projects" style={{
              padding: '32px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '16px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: '#f3f4f6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>My Projects</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Manage your saved projects</p>
            </Link>
          </div>

          {/* Features Section */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '64px 48px',
            border: '1px solid #e5e7eb',
            marginBottom: '32px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#16a34a',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                ENTERPRISE FEATURES
              </div>
              <h2 style={{
                fontSize: '48px',
                marginBottom: '16px',
                fontWeight: '800',
                color: '#000000'
              }}>
                Production-Ready Platform
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Professional-grade infrastructure trusted by developers and enterprises worldwide.
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '32px'
            }}>
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Instant APK Generation
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Transform web applications into native Android APKs in under 60 seconds with our optimized build pipeline and advanced caching system.
                </p>
              </div>
              
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Enterprise Security
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  SOC 2 Type II certified infrastructure with end-to-end encryption, secure processing environments, and automatic data cleanup protocols.
                </p>
              </div>
              
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Native Performance
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Optimized WebView integration delivering smooth 60fps performance with native-like interactions and Play Store compliance built-in.
                </p>
              </div>
              
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Real-Time Analytics
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Comprehensive build metrics, performance tracking, and deployment analytics with detailed insights and automated monitoring.
                </p>
              </div>
              
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Universal Framework Support
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Full compatibility with React, Vue, Angular, Next.js, and vanilla projects with automatic framework detection and optimization.
                </p>
              </div>
              
              <div style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,14L17.5,7.5L16.08,6.08L11,11.17L7.92,8.09L6.5,9.5L11,14Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000000'
                }}>
                  Play Store Optimization
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Automated compliance checking, digital signing, and optimization for Google Play Store with built-in app bundle generation.
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">How It Works</div>
              <div className="card-subtitle">Simple steps to build your mobile app</div>
            </div>
            <div className="card-content">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '32px' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    1
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-900)' }}>
                    Upload Your Project
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    Upload your web project files or provide a website URL. 
                    We support ZIP files, individual files, or direct URLs.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    2
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-900)' }}>
                    Configure Settings
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    Set your app name, package ID, icons, and other configurations. 
                    Our system will guide you through each step.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, var(--success), var(--accent))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    3
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-900)' }}>
                    Download Your APK
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    Our system builds your APK and provides a download link. 
                    Ready for installation or Google Play Store upload.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CleanModernHome;