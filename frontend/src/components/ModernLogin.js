import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  AlertCircle,
  Loader,
  ArrowLeft,
  Chrome,
  Github,
  Rocket
} from 'lucide-react';
import '../styles/modern.css';

const ModernLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        await signUp(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'github') {
        await signInWithGitHub();
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-app">
      {/* Header */}
      <header className="modern-header">
        <div className="header-container">
          <a href="/" className="logo">
            <div className="logo-icon">
              <Rocket size={18} />
            </div>
            <span className="logo-text">APK Generator</span>
          </a>
          
          <nav className="nav-menu">
            <a href="/" className="nav-link">
              <ArrowLeft size={16} style={{ marginRight: '4px' }} />
              Back to Home
            </a>
          </nav>
        </div>
      </header>

      <main style={{ 
        flex: 1,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'var(--spacing-lg)',
        background: 'var(--gray-50)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Login Card */}
          <div className="card">
            <div className="card-content" style={{ padding: '48px 32px' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: 'var(--primary-blue)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <Rocket size={28} color="white" />
                </div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: '600', 
                  color: 'var(--gray-900)', 
                  marginBottom: '8px'
                }}>
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p style={{ color: 'var(--gray-600)', fontSize: '16px' }}>
                  {isSignUp 
                    ? 'Join thousands of developers creating amazing mobile apps' 
                    : 'Sign in to access your APK generator dashboard'
                  }
                </p>
              </div>

              {/* Social Login Buttons */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginBottom: '12px', justifyContent: 'flex-start', padding: '16px' }}
                >
                  <Chrome size={20} style={{ marginRight: '12px' }} />
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '16px' }}
                >
                  <Github size={20} style={{ marginRight: '12px' }} />
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div style={{ 
                position: 'relative', 
                textAlign: 'center', 
                marginBottom: '24px',
                color: 'var(--gray-500)',
                fontSize: '14px'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--gray-200)',
                  zIndex: 1
                }}></div>
                <span style={{ 
                  background: 'white', 
                  padding: '0 16px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  or continue with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} style={{ marginRight: '8px' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Lock size={16} style={{ marginRight: '8px' }} />
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="form-input"
                      style={{ paddingRight: '48px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--gray-500)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="form-group">
                    <label className="form-label">
                      <Lock size={16} style={{ marginRight: '8px' }} />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="form-input"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="alert alert-error">
                    <AlertCircle size={20} style={{ marginRight: '12px' }} />
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    marginBottom: '24px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? <UserPlus className="btn-icon" /> : <LogIn className="btn-icon" />}
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </button>

                {/* Forgot Password */}
                {!isSignUp && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <a 
                      href="#" 
                      style={{ 
                        color: 'var(--primary-blue)', 
                        textDecoration: 'none', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>
                )}

                {/* Toggle Sign In/Up */}
                <div style={{ 
                  textAlign: 'center',
                  padding: '24px 0 0',
                  borderTop: '1px solid var(--gray-200)'
                }}>
                  <span style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                    {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setFormData({ email: '', password: '', confirmPassword: '' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-blue)',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginLeft: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {isSignUp ? 'Sign In' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px',
            fontSize: '13px',
            color: 'var(--gray-500)'
          }}>
            <p>
              By continuing, you agree to our{' '}
              <a href="#" style={{ color: 'var(--primary-blue)' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernLogin;