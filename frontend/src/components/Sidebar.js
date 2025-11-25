import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Zap,
  BarChart3,
  User,
  Settings,
  LogOut,
  Plus,
  Download,
  History,
  HelpCircle,
  Smartphone,
  Code,
  Users,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigationItems = [
    {
      section: 'Main',
      items: [
        {
          icon: Home,
          label: 'Home',
          path: '/',
          badge: null
        },
        {
          icon: Zap,
          label: 'Generate APK',
          path: '/generate',
          badge: 'New'
        },
        {
          icon: BarChart3,
          label: 'Dashboard',
          path: '/dashboard',
          badge: null
        }
      ]
    },
    {
      section: 'Apps',
      items: [
        {
          icon: Smartphone,
          label: 'My Apps',
          path: '/apps',
          badge: '12'
        },
        {
          icon: Download,
          label: 'Downloads',
          path: '/downloads',
          badge: null
        },
        {
          icon: History,
          label: 'Recent',
          path: '/recent',
          badge: null
        }
      ]
    },
    {
      section: 'Tools',
      items: [
        {
          icon: Code,
          label: 'Developer Tools',
          path: '/dev-tools',
          badge: null
        },
        {
          icon: Shield,
          label: 'Security',
          path: '/security',
          badge: null
        },
        {
          icon: Users,
          label: 'Team',
          path: '/team',
          badge: null
        }
      ]
    },
    {
      section: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          path: '/help',
          badge: null
        },
        {
          icon: Settings,
          label: 'Settings',
          path: '/settings',
          badge: null
        }
      ]
    }
  ];

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          APK Generator
        </div>
        <div className="sidebar-subtitle">
          Transform websites to mobile apps
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigationItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <div className="nav-section-title">
              {section.section}
            </div>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <div
                  key={itemIndex}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="nav-item-icon" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="nav-item-badge">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-footer">
        {user ? (
          <div className="user-profile" onClick={() => navigate('/profile')}>
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-info">
              <div className="user-name">
                {user.displayName || 'User'}
              </div>
              <div className="user-email">
                {user.email}
              </div>
            </div>
            <div className="user-status"></div>
          </div>
        ) : (
          <div 
            className="nav-item"
            onClick={() => navigate('/login')}
          >
            <User className="nav-item-icon" />
            <span>Sign In</span>
          </div>
        )}
        
        {user && (
          <div 
            className="nav-item"
            onClick={handleSignOut}
            style={{ marginTop: '12px', opacity: isLoggingOut ? 0.5 : 1 }}
          >
            <LogOut className="nav-item-icon" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;