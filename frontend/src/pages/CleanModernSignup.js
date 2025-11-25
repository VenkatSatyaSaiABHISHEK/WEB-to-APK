import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { emailService, serverHealthChecker } from '../utils/emailService';

function CleanModernSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const { signup, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    const result = await serverHealthChecker.checkStatus();
    setServerStatus(result.status);
    
    if (result.status === 'offline') {
      // Automatically notify admin about server being down
      await emailService.sendServerDownNotification(email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGitHub();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with GitHub: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Server Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '12px',
          borderRadius: '12px',
          background: serverStatus === 'online' ? '#dcfce7' : 
                     serverStatus === 'offline' ? '#fef2f2' : '#fef3c7',
          border: `1px solid ${serverStatus === 'online' ? '#16a34a' : 
                                serverStatus === 'offline' ? '#dc2626' : '#d97706'}`
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: serverStatus === 'online' ? '#16a34a' : 
                       serverStatus === 'offline' ? '#dc2626' : '#d97706',
            marginRight: '8px'
          }}></div>
          <span className="font-mono" style={{
            fontSize: '14px',
            color: serverStatus === 'online' ? '#15803d' : 
                   serverStatus === 'offline' ? '#b91c1c' : '#b45309',
            fontWeight: '600'
          }}>
            Server {serverStatus === 'online' ? 'Online' : 
                    serverStatus === 'offline' ? 'Offline - Admin Notified' : 'Checking...'}
          </span>
        </div>

        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '800'
            }}>
              A
            </div>
            <span className="font-heading" style={{
              fontSize: '28px',
              color: 'var(--gray-900)'
            }}>
              APK Builder
            </span>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="font-display" style={{
            fontSize: '32px',
            color: 'var(--gray-900)',
            marginBottom: '8px'
          }}>
            Create Account
          </h1>
          <p className="font-body" style={{
            fontSize: '16px',
            color: 'var(--gray-600)'
          }}>
            Join thousands of developers building mobile apps
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span style={{ color: '#b91c1c', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'var(--gray-400)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && <div className="spinner"></div>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          color: 'var(--gray-500)',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
          <span style={{ padding: '0 16px', fontWeight: '500' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
        </div>

        {/* Social Signup */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              border: '2px solid var(--gray-300)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--gray-700)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            onClick={handleGitHubSignup}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: 'var(--gray-900)',
              border: 'none',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Login Link */}
        <div style={{
          textAlign: 'center',
          padding: '16px',
          background: 'var(--gray-50)',
          borderRadius: '12px'
        }}>
          <span style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign In
            </Link>
          </span>
        </div>

        {/* Contact Admin */}
        {serverStatus === 'offline' && (
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            padding: '16px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <p className="font-body" style={{
              fontSize: '14px',
              color: '#92400e',
              marginBottom: '12px'
            }}>
              Server is currently offline. Admin has been automatically notified.
            </p>
            <a
              href="mailto:chgroup22@gmail.com?subject=APK Builder Server Issue&body=Hi, I'm trying to access the APK Builder platform but the server appears to be offline. Please check the backend server status."
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#d97706',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Admin
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CleanModernSignup;