import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CleanModernLogin from './components/CleanModernLogin';
import CleanModernSignup from './pages/CleanModernSignup';
import UserProfile from './components/UserProfile';
import CleanModernHome from './pages/CleanModernHome';
import Dashboard from './pages/Dashboard';
import CleanModernAppGenerator from './pages/CleanModernAppGenerator';
import Projects from './pages/Projects';
import ServerStatusBanner from './components/ServerStatusBanner';
import './styles/clean-modern.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ServerStatusBanner />
        <Routes>
          <Route path="/" element={<CleanModernHome />} />
          <Route path="/login" element={<CleanModernLogin />} />
          <Route path="/signup" element={<CleanModernSignup />} />
          <Route 
            path="/generate" 
            element={
              <ProtectedRoute>
                <CleanModernAppGenerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder" 
            element={
              <ProtectedRoute>
                <CleanModernAppGenerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={
              <div style={{
                padding: '50px',
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" style={{ color: '#22c55e', textDecoration: 'none' }}>Go Home</a>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;