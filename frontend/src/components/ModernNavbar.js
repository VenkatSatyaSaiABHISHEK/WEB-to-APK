import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Zap,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import '../styles/modern.css';

const ModernNavbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/generate', label: 'Generate APK' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="top-nav">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Zap size={20} />
          </div>
          APK Generator
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-user">
                <div className="nav-avatar">
                  {getUserInitials()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {user.displayName || user.email}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', minHeight: 'auto' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <User size={16} />
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--gray-700)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--white)',
          borderTop: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-2)',
          padding: '16px'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              style={{
                display: 'block',
                padding: '12px 0',
                color: location.pathname === item.path ? 'var(--primary-blue)' : 'var(--gray-700)',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: '1px solid var(--gray-200)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-menu {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: block !important;
          }
          
          .nav-actions {
            gap: 8px;
          }
          
          .nav-user {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default ModernNavbar;