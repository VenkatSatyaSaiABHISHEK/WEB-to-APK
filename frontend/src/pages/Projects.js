import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Projects() {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen] = useState(false);
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

  // Sample projects data (replace with real data from API)
  const projects = [
    {
      id: 1,
      name: "My Portfolio App",
      url: "https://myportfolio.com",
      status: "completed",
      createdAt: "2024-11-20",
      downloads: 45
    },
    {
      id: 2,
      name: "Restaurant Menu",
      url: "https://restaurantmenu.com", 
      status: "processing",
      createdAt: "2024-11-25",
      downloads: 0
    },
    {
      id: 3,
      name: "Business Website",
      url: "https://mybusiness.com",
      status: "completed", 
      createdAt: "2024-11-18",
      downloads: 123
    }
  ];

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
              <div className="page-title">My Projects</div>
              <div className="breadcrumb">
                <span>Management</span>
                <span className="breadcrumb-separator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                </span>
                <span>Projects</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
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

        {/* Main Content */}
        <main className="main-content">
          {/* Page Header */}
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '48px',
                marginBottom: '12px',
                fontWeight: '800',
                color: '#000000'
              }}>
                My Projects
              </h1>
              <p style={{
                fontSize: '20px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Manage and track your APK generation projects
              </p>
            </div>
            <Link 
              to="/generate"
              style={{
                padding: '16px 24px',
                background: '#22c55e',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
              New Project
            </Link>
          </div>

          {/* Projects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Project Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: project.status === 'completed' ? '#22c55e' : '#f59e0b',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
                    </svg>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    background: project.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: project.status === 'completed' ? '#16a34a' : '#d97706',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {project.status}
                  </div>
                </div>

                {/* Project Info */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  {project.name}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  {project.url}
                </p>

                {/* Project Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>
                      {project.downloads}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Downloads
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Created
                    </div>
                  </div>
                </div>

                {/* Project Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {project.status === 'completed' ? (
                    <>
                      <button style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Download APK
                      </button>
                      <button style={{
                        padding: '10px 16px',
                        background: '#ffffff',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Share
                      </button>
                    </>
                  ) : (
                    <button style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Processing...
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add New Project Card */}
            <Link 
              to="/generate"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '2px dashed #e5e7eb',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                color: '#6b7280',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Create New Project
              </h3>
              <p style={{
                fontSize: '14px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                Generate a new APK from your website
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Projects;