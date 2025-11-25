// Email service utility for sending notifications
export const emailService = {
  // Send email to admin when server is down
  sendServerDownNotification: async (userEmail = 'anonymous') => {
    try {
      // In a real implementation, this would use a service like EmailJS
      // For now, we'll create a mailto link
      const subject = encodeURIComponent('APK Builder Server Down Alert');
      const body = encodeURIComponent(`
The APK Builder backend server is currently offline. Please check and restart the server.

Details:
- Time: ${new Date().toLocaleString()}
- User: ${userEmail}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}

Please investigate and restart the backend server as soon as possible.
      `);
      
      // Auto-open email client (this will work better than fetch in many cases)
      const mailtoLink = `mailto:chgroup22@gmail.com?subject=${subject}&body=${body}`;
      
      // Try to open email client
      if (window.confirm('Server is offline. Would you like to notify the admin via email?')) {
        window.open(mailtoLink);
      }
      
      return { success: true, method: 'mailto' };
    } catch (error) {
      console.error('Failed to send notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send general contact email
  sendContactEmail: (subject, message, userEmail = '') => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(`
From: ${userEmail || 'Anonymous User'}
Time: ${new Date().toLocaleString()}

Message:
${message}

---
Sent from APK Builder Platform
    `);
    
    const mailtoLink = `mailto:chgroup22@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    window.open(mailtoLink);
  }
};

// Server status checker
export const serverHealthChecker = {
  checkStatus: async () => {
    try {
      // Try multiple endpoints to check server status
      const endpoints = ['/api/health', '/api/status', '/health'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            timeout: 5000
          });
          
          if (response.ok) {
            return { status: 'online', endpoint };
          }
        } catch (err) {
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints fail, server is offline
      return { status: 'offline', error: 'All health check endpoints failed' };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  },

  // Start periodic health checks
  startMonitoring: (callback, interval = 30000) => {
    const checkHealth = async () => {
      const result = await serverHealthChecker.checkStatus();
      callback(result);
    };
    
    // Initial check
    checkHealth();
    
    // Set up periodic checks
    return setInterval(checkHealth, interval);
  }
};