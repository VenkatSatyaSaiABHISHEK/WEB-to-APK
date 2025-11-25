// API Configuration
const API_CONFIG = {
  // When you get ngrok URL, replace this
  production: 'https://your-ngrok-url.ngrok.io/api', // Replace with your ngrok URL
  development: 'http://localhost:5000/api',
  fallback: 'http://localhost:5000/api'
};

// Auto-detect environment
const getApiUrl = () => {
  if (window.location.hostname === 'localhost') {
    return API_CONFIG.development;
  }
  
  // For Vercel deployment, use ngrok URL
  return API_CONFIG.production;
};

export const API_BASE_URL = getApiUrl();
export default API_CONFIG;