import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CleanModernLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const { user, login, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkServerStatus();
    
    // Redirect if user is already logged in
    if (user) {
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      navigate(intendedPath, { replace: true });
    }
  }, [user, navigate, location]);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      setServerStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
      sendServerDownEmail();
    }
  };

  const sendServerDownEmail = async () => {
    try {
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'chgroup22@gmail.com',
          subject: 'APK Builder Server Down Alert',
          message: `The APK Builder backend server is currently offline. Please check and restart the server.\n\nTime: ${new Date().toLocaleString()}\nUser attempted login at: ${window.location.href}`
        })
      });
    } catch (error) {
      console.log('Could not send notification email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      console.log('Attempting login with email:', email);
      
      const result = await login(email, password);
      console.log('Login successful, user:', result);
      
      // Redirect to intended page or dashboard
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      console.log('Redirecting to:', intendedPath);
      navigate(intendedPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      // Redirect to intended page or dashboard
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      navigate(intendedPath, { replace: true });
    } catch (error) {
      setError('Failed to log in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGitHub();
      // Redirect to intended page or dashboard
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      navigate(intendedPath, { replace: true });
    } catch (error) {
      setError('Failed to log in with GitHub: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      {/* Back to Home Link */}
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'rgba(255,255,255,0.9)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'color 0.2s',
          zIndex: 10
        }}
        onMouseOver={(e) => e.target.style.color = 'white'}
        onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        Back to Home
      </Link>

      {/* Login Card */}
      <div style={{
        background: 'var(--white)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'white',
            fontSize: '32px',
            fontWeight: '700'
          }}>
            A
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--gray-900)',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--gray-600)',
            lineHeight: '1.5'
          }}>
            Sign in to access your APK Builder dashboard and manage your projects
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,13H11V7H13M11,15H13V17H11M15.73,3H8.27L3,8.27V15.73L8.27,21H15.73L21,15.73V8.27L15.73,3Z"/>
            </svg>
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              border: '1px solid var(--gray-300)',
              borderRadius: '12px',
              background: 'var(--white)',
              color: 'var(--gray-700)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = 'var(--gray-50)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--white)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              border: '1px solid var(--gray-300)',
              borderRadius: '12px',
              background: 'var(--white)',
              color: 'var(--gray-700)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = 'var(--gray-50)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--white)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '32px 0',
          color: 'var(--gray-500)',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
          <span style={{ padding: '0 20px', fontWeight: '600' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
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
              marginTop: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{
                  borderTopColor: 'white',
                  width: '20px',
                  height: '20px'
                }}></div>
                Signing In...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          fontSize: '15px',
          color: 'var(--gray-600)'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/signup"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Create Account
          </Link>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--gray-50)',
          borderRadius: '12px',
          fontSize: '13px',
          color: 'var(--gray-600)',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
          </svg>
          Your data is protected with enterprise-grade security
        </div>
      </div>
    </div>
  );
}

export default CleanModernLogin;