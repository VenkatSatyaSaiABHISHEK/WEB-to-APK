import React, { useState } from 'react';
import { 
  Palette, 
  Image, 
  Navigation, 
  Shield, 
  Settings, 
  ChevronDown,
  ChevronUp,
  Eye,
  Upload,
  X
} from 'lucide-react';

const AppCustomization = ({ customization, onCustomizationChange }) => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [splashPreview, setSplashPreview] = useState(customization?.splashScreen || null);

  const handleSectionToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleCustomizationUpdate = (category, key, value) => {
    const updated = {
      ...customization,
      [category]: {
        ...customization[category],
        [key]: value
      }
    };
    onCustomizationChange(updated);
  };

  const handleSplashScreenUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setSplashPreview(result);
        handleCustomizationUpdate('appearance', 'splashScreenFile', file);
        handleCustomizationUpdate('appearance', 'splashScreen', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSplashScreen = () => {
    setSplashPreview(null);
    handleCustomizationUpdate('appearance', 'splashScreenFile', null);
    handleCustomizationUpdate('appearance', 'splashScreen', null);
  };

  const customizationSections = [
    {
      id: 'appearance',
      title: 'App Appearance',
      icon: Palette,
      description: 'Customize colors, splash screen, and visual elements'
    },
    {
      id: 'navigation',
      title: 'Navigation & UI',
      icon: Navigation,
      description: 'Configure app navigation and user interface options'
    },
    {
      id: 'permissions',
      title: 'App Permissions',
      icon: Shield,
      description: 'Select required Android permissions for your app'
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      icon: Settings,
      description: 'Additional configuration options and features'
    }
  ];

  const commonPermissions = [
    { id: 'INTERNET', name: 'Internet Access', description: 'Required for web content' },
    { id: 'CAMERA', name: 'Camera', description: 'Access device camera' },
    { id: 'WRITE_EXTERNAL_STORAGE', name: 'Storage Write', description: 'Save files to device storage' },
    { id: 'READ_EXTERNAL_STORAGE', name: 'Storage Read', description: 'Read files from device storage' },
    { id: 'ACCESS_FINE_LOCATION', name: 'Location (GPS)', description: 'Access precise location' },
    { id: 'ACCESS_COARSE_LOCATION', name: 'Location (Network)', description: 'Access approximate location' },
    { id: 'RECORD_AUDIO', name: 'Microphone', description: 'Record audio' },
    { id: 'VIBRATE', name: 'Vibration', description: 'Control device vibration' },
    { id: 'WAKE_LOCK', name: 'Keep Screen On', description: 'Prevent device from sleeping' },
    { id: 'ACCESS_NETWORK_STATE', name: 'Network State', description: 'Check network connectivity' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Advanced Customization
        </h3>
        <p className="text-purple-100 text-sm mt-1">
          Customize your app's appearance, behavior, and permissions
        </p>
      </div>

      <div className="p-6 space-y-4">
        {customizationSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleSectionToggle(section.id)}
                className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-600 mr-3" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                {isActive ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isActive && (
                <div className="p-4 bg-white border-t border-gray-200">
                  {section.id === 'appearance' && (
                    <div className="space-y-6">
                      {/* Theme Colors */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">App Theme Colors</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Primary Color
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={customization?.appearance?.primaryColor || '#3B82F6'}
                                onChange={(e) => handleCustomizationUpdate('appearance', 'primaryColor', e.target.value)}
                                className="w-12 h-8 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                value={customization?.appearance?.primaryColor || '#3B82F6'}
                                onChange={(e) => handleCustomizationUpdate('appearance', 'primaryColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="#3B82F6"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Secondary Color
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={customization?.appearance?.secondaryColor || '#10B981'}
                                onChange={(e) => handleCustomizationUpdate('appearance', 'secondaryColor', e.target.value)}
                                className="w-12 h-8 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                value={customization?.appearance?.secondaryColor || '#10B981'}
                                onChange={(e) => handleCustomizationUpdate('appearance', 'secondaryColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="#10B981"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Splash Screen */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Custom Splash Screen</h5>
                        <div className="space-y-3">
                          {splashPreview ? (
                            <div className="relative inline-block">
                              <img
                                src={splashPreview}
                                alt="Splash screen preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                onClick={removeSplashScreen}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 mb-2">Upload custom splash screen</p>
                              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleSplashScreenUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                          <p className="text-sm text-gray-500">
                            Recommended: 1080x1920px (9:16 ratio) for best results
                          </p>
                        </div>
                      </div>

                      {/* Status Bar */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Status Bar Style</h5>
                        <div className="space-y-2">
                          {['default', 'light-content', 'dark-content'].map((style) => (
                            <label key={style} className="flex items-center">
                              <input
                                type="radio"
                                name="statusBarStyle"
                                value={style}
                                checked={(customization?.appearance?.statusBarStyle || 'default') === style}
                                onChange={(e) => handleCustomizationUpdate('appearance', 'statusBarStyle', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700 capitalize">
                                {style.replace('-', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'navigation' && (
                    <div className="space-y-6">
                      {/* Navigation Options */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Navigation Features</h5>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Show Navigation Bar</span>
                            <input
                              type="checkbox"
                              checked={customization?.navigation?.showNavigationBar !== false}
                              onChange={(e) => handleCustomizationUpdate('navigation', 'showNavigationBar', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable Back Button</span>
                            <input
                              type="checkbox"
                              checked={customization?.navigation?.enableBackButton !== false}
                              onChange={(e) => handleCustomizationUpdate('navigation', 'enableBackButton', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable Refresh Button</span>
                            <input
                              type="checkbox"
                              checked={customization?.navigation?.enableRefresh !== false}
                              onChange={(e) => handleCustomizationUpdate('navigation', 'enableRefresh', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Show Progress Bar</span>
                            <input
                              type="checkbox"
                              checked={customization?.navigation?.showProgressBar !== false}
                              onChange={(e) => handleCustomizationUpdate('navigation', 'showProgressBar', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Orientation */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Screen Orientation</h5>
                        <select
                          value={customization?.navigation?.orientation || 'portrait'}
                          onChange={(e) => handleCustomizationUpdate('navigation', 'orientation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="portrait">Portrait Only</option>
                          <option value="landscape">Landscape Only</option>
                          <option value="auto">Auto Rotate</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {section.id === 'permissions' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Select the permissions your app needs. Only request permissions that are actually required.
                      </p>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {commonPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              id={`permission-${permission.id}`}
                              checked={customization?.permissions?.[permission.id] || permission.id === 'INTERNET'}
                              onChange={(e) => handleCustomizationUpdate('permissions', permission.id, e.target.checked)}
                              disabled={permission.id === 'INTERNET'}
                              className="mt-1 rounded"
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={`permission-${permission.id}`} 
                                className="block text-sm font-medium text-gray-900 cursor-pointer"
                              >
                                {permission.name}
                                {permission.id === 'INTERNET' && (
                                  <span className="text-xs text-blue-600 ml-1">(Required)</span>
                                )}
                              </label>
                              <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === 'advanced' && (
                    <div className="space-y-6">
                      {/* App Behavior */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">App Behavior</h5>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable Hardware Acceleration</span>
                            <input
                              type="checkbox"
                              checked={customization?.advanced?.hardwareAcceleration !== false}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'hardwareAcceleration', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable JavaScript</span>
                            <input
                              type="checkbox"
                              checked={customization?.advanced?.enableJavaScript !== false}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'enableJavaScript', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable DOM Storage</span>
                            <input
                              type="checkbox"
                              checked={customization?.advanced?.enableDomStorage !== false}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'enableDomStorage', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Allow File Downloads</span>
                            <input
                              type="checkbox"
                              checked={customization?.advanced?.allowFileDownloads || false}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'allowFileDownloads', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                        </div>
                      </div>

                      {/* User Agent */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom User Agent (Optional)
                        </label>
                        <input
                          type="text"
                          value={customization?.advanced?.userAgent || ''}
                          onChange={(e) => handleCustomizationUpdate('advanced', 'userAgent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty for default user agent"
                        />
                      </div>

                      {/* Zoom Controls */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Zoom Settings</h5>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable Zoom Controls</span>
                            <input
                              type="checkbox"
                              checked={customization?.advanced?.enableZoom || false}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'enableZoom', e.target.checked)}
                              className="rounded"
                            />
                          </label>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Initial Zoom Level (%)
                            </label>
                            <input
                              type="range"
                              min="50"
                              max="200"
                              value={customization?.advanced?.initialZoom || 100}
                              onChange={(e) => handleCustomizationUpdate('advanced', 'initialZoom', parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>50%</span>
                              <span>{customization?.advanced?.initialZoom || 100}%</span>
                              <span>200%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-1" />
            Customization Preview
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: customization?.appearance?.primaryColor || '#3B82F6' }}
              />
              Primary
            </div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: customization?.appearance?.secondaryColor || '#10B981' }}
              />
              Secondary
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCustomization;