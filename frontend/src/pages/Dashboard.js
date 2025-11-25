import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Calendar, 
  Globe, 
  TrendingUp, 
  Smartphone,
  Users,
  BarChart3,
  Palette,
  Settings,
  Home,
  Zap,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      fetchApps();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchApps = async () => {
    try {
      if (user) {
        // Fetch user-specific apps
        const response = await axios.get(`http://localhost:5000/api/user/${user.uid}/apps`);
        setApps(response.data);
      } else {
        // Fallback to all apps if not authenticated
        const response = await axios.get('http://localhost:5000/api/apps');
        setApps(response.data);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppStats = async (appId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stats/${appId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching app stats:', error);
    }
  };

  const handleViewStats = (app) => {
    setSelectedApp(app);
    fetchAppStats(app.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyShareLink = (shareLink) => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  const totalDownloads = apps.reduce((sum, app) => sum + app.download_count, 0);
  const totalApps = apps.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">WebToAPK</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/generate" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Generate</span>
            </Link>
            <div className="flex items-center space-x-1 text-blue-600">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </div>
            <Link 
              to="/profile" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">#
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your generated apps and download statistics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Apps</p>
                <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalApps > 0 ? Math.round(totalDownloads / totalApps) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Apps</h2>
          </div>

          {apps.length === 0 ? (
            <div className="p-12 text-center">
              <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No apps yet</h3>
              <p className="text-gray-600 mb-4">
                Start by generating your first Android app from a website
              </p>
              <a
                href="/generate"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate First App
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <div 
                              className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"
                              style={{ 
                                backgroundColor: app.customization ? 
                                  JSON.parse(app.customization)?.appearance?.primaryColor + '20' || '#EBF8FF' : 
                                  '#EBF8FF' 
                              }}
                            >
                              <Smartphone 
                                className="h-5 w-5"
                                style={{ 
                                  color: app.customization ? 
                                    JSON.parse(app.customization)?.appearance?.primaryColor || '#2563EB' : 
                                    '#2563EB' 
                                }}
                              />
                            </div>
                            {app.customization && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <Palette className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {app.name}
                              </div>
                              {app.customization && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Customized
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {app.id.substring(0, 8)}... 
                              {user && app.user_id === user.uid && (
                                <span className="ml-1 text-green-600">• Your app</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs"
                          >
                            {app.url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {app.download_count}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {formatDate(app.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewStats(app)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <BarChart3 className="h-4 w-4 inline mr-1" />
                          Stats
                        </button>
                        <a
                          href={`http://localhost:5000/api/download/${app.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-4 w-4 inline mr-1" />
                          Download
                        </a>
                        <button
                          onClick={() => copyShareLink(app.share_link)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Share2 className="h-4 w-4 inline mr-1" />
                          Share
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* App Statistics Modal/Section */}
        {selectedApp && stats && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedApp.name} - Statistics
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedApp(null);
                      setStats(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-6 w-6 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-blue-600">Total Downloads</p>
                          <p className="text-xl font-bold text-blue-900">
                            {stats.totalDownloads}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm text-green-600">Created</p>
                          <p className="text-lg font-semibold text-green-900">
                            {formatDate(stats.app.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {stats.dailyStats.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">
                        Download History (Last 30 Days)
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {stats.dailyStats.map((day, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {day.downloads} downloads
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-4">
                    <a
                      href={`http://localhost:5000/api/download/${selectedApp.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                    >
                      Download APK
                    </a>
                    <button
                      onClick={() => copyShareLink(selectedApp.share_link)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Copy Share Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;