import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  Upload, 
  Smartphone, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Globe,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

const AppGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData(prev => ({ ...prev, icon: file }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('App name is required');
      return;
    }

    if (!formData.url.trim()) {
      setError('Website URL is required');
      return;
    }

    if (!validateUrl(formData.url)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsGenerating(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('url', formData.url.trim());
      
      if (formData.icon) {
        submitData.append('icon', formData.icon);
      }

      const response = await axios.post('http://localhost:5000/api/generate-app', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setGeneratedApp(response.data.app);
      setStep(3);
    } catch (error) {
      console.error('Error generating app:', error);
      setError(error.response?.data?.error || 'Failed to generate app. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(generatedApp.shareLink);
    alert('Share link copied to clipboard!');
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', icon: null });
    setGeneratedApp(null);
    setError('');
    setStep(1);
  };

  if (step === 3 && generatedApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Your App is Ready!
            </h1>
            <p className="text-gray-600 text-lg">
              "{generatedApp.name}" has been successfully created
            </p>
          </div>

          {/* App Preview Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {generatedApp.name}
              </h2>
              <p className="text-gray-600 flex items-center justify-center">
                <Globe className="h-4 w-4 mr-2" />
                {formData.url}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={generatedApp.downloadLink}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Download className="h-5 w-5" />
                <span>Download APK</span>
              </a>
              
              <button
                onClick={copyShareLink}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Share2 className="h-5 w-5" />
                <span>Share App</span>
              </button>
            </div>
          </div>

          {/* Success Notice */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-green-800 font-medium mb-1">🎉 REAL Android APK Generated!</h3>
                <p className="text-green-700 text-sm">
                  This is a <strong>genuine Android APK file</strong> that can be installed on any Android device. 
                  The app uses WebView to load your website with native Android features like splash screen, 
                  custom icon, and proper app structure.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps:</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <span>Download the APK file to your Android device</span>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <span>Enable "Unknown Sources" in Android Settings</span>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <span>Install and enjoy your custom app!</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Create Another App
            </button>
            <a
              href="/dashboard"
              className="flex-1 bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl text-center hover:bg-purple-700 transition-colors duration-200"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Mobile App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform any website into a native-feeling Android app in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Website URL Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                <Globe className="inline h-5 w-5 mr-2" />
                Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Enter the full URL of the website you want to convert
              </p>
            </div>

            {/* App Name Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                <Smartphone className="inline h-5 w-5 mr-2" />
                App Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome App"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                This will be displayed as your app name on Android devices
              </p>
            </div>

            {/* App Icon Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                <ImageIcon className="inline h-5 w-5 mr-2" />
                App Icon (Optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : formData.icon
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                {formData.icon ? (
                  <div>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-700 font-medium">{formData.icon.name}</p>
                    <p className="text-green-600 text-sm">Click or drag to change icon</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">
                      {isDragActive ? 'Drop your icon here' : 'Upload App Icon'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Drag & drop or click to select (PNG, JPG, up to 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                  Generating Your App...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Smartphone className="h-5 w-5 mr-3" />
                  Generate Android App
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real Android APK</h3>
            <p className="text-gray-600 text-sm">
              Generate genuine Android APK files using Cordova and Android SDK
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Installable Apps</h3>
            <p className="text-gray-600 text-sm">
              APK files can be installed directly on Android devices
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Apps</h3>
            <p className="text-gray-600 text-sm">
              Complete app structure with splash screens, icons, and native features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppGenerator;