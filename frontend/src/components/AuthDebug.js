import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function AuthDebug() {
  const { user, loading, error } = useAuth();

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      border: '2px solid #ccc',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h3>🔍 Authentication Debug Info</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Error:</strong> {error || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>User Status:</strong> {user ? 'Logged In' : 'Not Logged In'}
      </div>
      
      {user && (
        <div style={{ marginBottom: '10px' }}>
          <strong>User Details:</strong>
          <pre style={{ background: '#fff', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '10px', padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Login
        </Link>
        <Link to="/signup" style={{ marginRight: '10px', padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Sign Up
        </Link>
        <Link to="/dashboard" style={{ marginRight: '10px', padding: '8px 16px', background: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AuthDebug;