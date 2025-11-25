import React, { useState, useEffect } from 'react';

function ServerStatusBanner() {
  const [isServerDown, setIsServerDown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/health', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          setIsServerDown(true);
        } else {
          setIsServerDown(false);
        }
      } catch (error) {
        console.log('Server connection failed:', error);
        setIsServerDown(true);
      }
    };

    // Check immediately
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Server Status Issue - APK Builder Platform');
    const body = encodeURIComponent(
      'Hello,\n\nThe APK Builder platform backend server appears to be down. Please check the server status and restart if necessary.\n\nWebsite: ' + window.location.origin + '\nTime: ' + new Date().toLocaleString() + '\n\nThank you!'
    );
    window.open(`mailto:chgroup22@gmail.com?subject=${subject}&body=${body}`);
  };

  if (!isServerDown || !isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      padding: '16px 20px',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      borderBottom: '3px solid #991b1b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '2px'
            }}>
              🚨 Server Currently Offline
            </div>
            <div style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              The backend server is not running. You can browse the website layout, but APK building is temporarily unavailable. 
              Please contact us to report this issue.
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleEmailClick}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4Z"/>
            </svg>
            Email Admin
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              e.target.style.opacity = '0.7';
            }}
            title="Hide this message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default ServerStatusBanner;