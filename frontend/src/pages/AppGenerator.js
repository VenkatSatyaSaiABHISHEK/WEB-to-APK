import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Globe, Smartphone, Download, Share2, Loader } from 'lucide-react';

const AppGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: ''
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedApp, setGeneratedApp] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setIconPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('App name is required');
      return false;
    }
    if (!formData.url.trim()) {
      setError('Website URL is required');
      return false;
    }
    
    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('url', formData.url);
      if (iconFile) {
        submitData.append('icon', iconFile);
      }
      
      const response = await axios.post('http://localhost:5000/api/generate-app', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setGeneratedApp(response.data.app);
    } catch (error) {
      console.error('Error generating app:', error);
      setError(error.response?.data?.error || 'Failed to generate app. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', url: '' });
    setIconFile(null);
    setIconPreview(null);
    setGeneratedApp(null);
    setError('');
  };

  if (generatedApp) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                App Generated Successfully!
              </h2>
              <p className="text-gray-600">
                Your Android APK is ready for download and sharing
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">App Details</h3>
              <div className="space-y-2 text-left">
                <p><span className="font-medium">App Name:</span> {generatedApp.name}</p>
                <p><span className="font-medium">Website:</span> {generatedApp.url}</p>
                <p><span className="font-medium">App ID:</span> {generatedApp.id}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={generatedApp.downloadLink}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="mr-2 h-5 w-5" />
                Download APK
              </a>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedApp.shareLink);
                  alert('Share link copied to clipboard!');
                }}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Copy Share Link
              </button>
            </div>
            
            <button
              onClick={resetForm}
              className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              Generate Another App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generate Android APK
          </h1>
          <p className="text-lg text-gray-600">
            Convert your website into a native Android app
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {/* App Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                App Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="My Awesome App"
                required
              />
            </div>
            
            {/* Website URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>
            
            {/* App Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Icon (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a square image (recommended: 512x512px)
                  </p>
                </div>
                {iconPreview && (
                  <div className="flex-shrink-0">
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    Generating APK...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    Generate APK
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We create a WebView-based Android app that loads your website</li>
              <li>• The generated APK can be installed on any Android device</li>
              <li>• Users will see your website in a native app interface</li>
              <li>• Download tracking and analytics are automatically enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppGenerator;