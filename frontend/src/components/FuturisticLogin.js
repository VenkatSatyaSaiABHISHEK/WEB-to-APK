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
  Github
} from 'lucide-react';
import '../styles/futuristic.css';

const FuturisticLogin = () => {
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
    <div className="main-content" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
    }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '32px',
            cursor: 'pointer',
            padding: '8px 0'
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="futuristic-card">
          <div className="card-content" style={{ padding: '48px 40px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                color: '#000', 
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p style={{ color: '#666', fontSize: '16px' }}>
                {isSignUp 
                  ? 'Join thousands of developers building amazing apps' 
                  : 'Sign in to access your APK generator dashboard'
                }
              </p>
            </div>

            {/* Social Login Buttons */}
            <div style={{ marginBottom: '32px' }}>
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#333',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#000';
                  e.target.style.background = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.background = '#fff';
                }}
              >
                <Chrome size={20} style={{ marginRight: '12px' }} />
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#333',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#000';
                  e.target.style.background = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.background = '#fff';
                }}
              >
                <Github size={20} style={{ marginRight: '12px' }} />
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div style={{ 
              position: 'relative', 
              textAlign: 'center', 
              marginBottom: '32px',
              color: '#999',
              fontSize: '14px'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: '#e9ecef',
                zIndex: 1
              }}></div>
              <span style={{ 
                background: '#fff', 
                padding: '0 16px',
                position: 'relative',
                zIndex: 2
              }}>
                or continue with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="futuristic-form">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} style={{ marginRight: '8px', display: 'inline' }} />
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
                  <Lock size={16} style={{ marginRight: '8px', display: 'inline' }} />
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
                      color: '#666',
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
                    <Lock size={16} style={{ marginRight: '8px', display: 'inline' }} />
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
                <div style={{ 
                  background: '#fff5f5', 
                  border: '1px solid #fed7d7', 
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <AlertCircle size={20} color="#e53e3e" style={{ marginRight: '12px' }} />
                  <span style={{ color: '#e53e3e', fontSize: '14px', fontWeight: '500' }}>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="futuristic-button"
                style={{ 
                  width: '100%', 
                  marginBottom: '24px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" style={{ marginRight: '8px' }} />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="button-icon" /> : <LogIn className="button-icon" />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>

              {/* Toggle Sign In/Up */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {isSignUp ? 'Already have an account?' : 'Don\\'t have an account?'}
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
                    color: '#000',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginLeft: '8px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
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
          marginTop: '32px',
          fontSize: '13px',
          color: '#999'
        }}>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuturisticLogin;