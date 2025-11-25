import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Zap, BarChart, Share2, Download, Globe, Plus } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Website to APK",
      description: "Convert any website into a native Android app with just a URL"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      title: "Custom Branding", 
      description: "Customize app name, icon, and appearance to match your brand"
    },
    {
      icon: <BarChart className="h-8 w-8 text-purple-600" />,
      title: "Analytics Dashboard",
      description: "Track downloads, user engagement, and app performance metrics"
    },
    {
      icon: <Share2 className="h-8 w-8 text-orange-600" />,
      title: "Easy Sharing",
      description: "Share your generated APK with a simple link or QR code"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Lightning Fast",
      description: "Generate APK files in minutes with our optimized conversion process"
    },
    {
      icon: <Download className="h-8 w-8 text-red-600" />,
      title: "Instant Download",
      description: "Download your APK immediately after generation is complete"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Convert Any Website to 
              <span className="block text-yellow-300">Android APK</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Transform your website into a native Android app in minutes. 
              Track downloads, customize branding, and share with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/generate"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Plus className="mr-2 h-5 w-5" />
                Generate APK Now
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-purple-700 transition-colors duration-200"
              >
                <BarChart className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to convert websites to mobile apps and track their success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process to convert your website to APK
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Website URL</h3>
              <p className="text-gray-600">
                Provide the URL of the website you want to convert to an Android app
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize App</h3>
              <p className="text-gray-600">
                Set app name, upload custom icon, and configure app settings
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
              <p className="text-gray-600">
                Download your APK file and share it with users via link or QR code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Create your first Android app from any website in just a few minutes
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-white text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <Smartphone className="mr-2 h-5 w-5" />
            Start Converting Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;