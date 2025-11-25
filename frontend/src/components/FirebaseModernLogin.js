import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function FirebaseModernLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGithub();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in with GitHub');
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
          transition: 'color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.color = 'white'}
        onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}
      >
        ← Back to Home
      </Link>

      {/* Login Card */}
      <div style={{
        background: 'var(--white)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--firebase-orange), var(--firebase-yellow))',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'white',
            fontSize: '32px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '400',
            color: 'var(--gray-900)',
            marginBottom: '12px'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--gray-600)',
            lineHeight: '1.5'
          }}>
            Sign in to access your APK Generator console
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #ffcdd2',
            color: '#c62828',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>⚠️</span>
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
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--gray-50)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-md)';
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
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--gray-50)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-md)';
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
          <span style={{ padding: '0 20px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '15px', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              style={{
                padding: '16px',
                fontSize: '16px',
                borderRadius: '12px',
                border: '2px solid var(--gray-200)',
                transition: 'all 0.2s ease'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '15px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              style={{
                padding: '16px',
                fontSize: '16px',
                borderRadius: '12px',
                border: '2px solid var(--gray-200)',
                transition: 'all 0.2s ease'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, var(--firebase-orange), #e65100)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
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
                e.target.style.boxShadow = '0 8px 25px rgba(255, 111, 0, 0.3)';
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
                Signing in...
              </>
            ) : (
              <>
                <span>🚀</span>
                Sign In to Console
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
              color: 'var(--firebase-orange)',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Create one here
          </Link>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(255, 111, 0, 0.1)',
          borderRadius: '12px',
          fontSize: '13px',
          color: 'var(--gray-600)',
          textAlign: 'center'
        }}>
          🔒 Your data is protected with enterprise-grade security
        </div>
      </div>
    </div>
  );
}

export default FirebaseModernLogin;