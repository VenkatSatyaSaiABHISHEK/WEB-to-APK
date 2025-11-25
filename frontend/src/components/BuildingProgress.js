import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Settings, 
  Palette, 
  Code, 
  Shield, 
  Package, 
  CheckCircle,
  Play,
  Zap,
  Stars,
  Rocket,
  Loader
} from 'lucide-react';

const BuildingProgress = ({ steps, appName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const runningStep = steps.findIndex(step => step.status === 'running');
    const lastCompletedStep = steps.map((step, index) => step.status === 'completed' ? index : -1)
                                   .filter(index => index !== -1)
                                   .pop();
    
    if (runningStep !== -1) {
      setCurrentStep(runningStep);
    } else if (lastCompletedStep !== -1) {
      setCurrentStep(lastCompletedStep);
    }
  }, [steps]);

  const getStepIcon = (stepIndex) => {
    const icons = [
      <Smartphone className="h-8 w-8" />,
      <Palette className="h-8 w-8" />,
      <Settings className="h-8 w-8" />,
      <Code className="h-8 w-8" />,
      <Shield className="h-8 w-8" />,
      <Package className="h-8 w-8" />,
      <Rocket className="h-8 w-8" />
    ];
    return icons[stepIndex] || <Settings className="h-8 w-8" />;
  };

  const getStepColor = (step) => {
    switch (step.status) {
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'running': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStepBorderColor = (step) => {
    switch (step.status) {
      case 'completed': return 'border-green-500';
      case 'running': return 'border-yellow-400 animate-pulse';
      default: return 'border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 animate-spin-slow border-8 border-white">
            <Rocket className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4 animate-pulse">
            🚀 BUILDING YOUR APP! 🚀
          </h1>
          <h2 className="text-4xl text-yellow-400 font-black">
            "{appName}"
          </h2>
          <p className="text-2xl text-gray-300 mt-4 font-bold">
            Hold on tight! We're crafting something <span className="text-pink-400">AMAZING</span>! ⚡
          </p>
        </div>

        {/* Main Flow Chart */}
        <div className="bg-white rounded-3xl shadow-2xl border-8 border-yellow-400 p-8 mb-8">
          <h3 className="text-4xl font-black text-black text-center mb-8">
            🔥 THE MAGIC PROCESS 🔥
          </h3>
          
          {/* Flow Chart Container */}
          <div className="relative">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {steps.map((_, index) => {
                if (index === steps.length - 1) return null;
                const isActive = index <= currentStep;
                return (
                  <g key={index}>
                    {/* Horizontal line to next step */}
                    {index % 2 === 0 && index < steps.length - 1 && (
                      <line
                        x1={`${(index % 3) * 33.33 + 16.66}%`}
                        y1={`${Math.floor(index / 3) * 200 + 100}px`}
                        x2={`${((index + 1) % 3) * 33.33 + 16.66}%`}
                        y2={`${Math.floor((index + 1) / 3) * 200 + 100}px`}
                        stroke={isActive ? '#22c55e' : '#9ca3af'}
                        strokeWidth="8"
                        strokeDasharray={isActive ? '0' : '20,10'}
                        className={isActive ? 'animate-pulse' : ''}
                      />
                    )}
                    {/* Vertical line down */}
                    {index % 3 === 2 && index < steps.length - 1 && (
                      <line
                        x1={`${(index % 3) * 33.33 + 16.66}%`}
                        y1={`${Math.floor(index / 3) * 200 + 100}px`}
                        x2={`${(index % 3) * 33.33 + 16.66}%`}
                        y2={`${Math.floor(index / 3) * 200 + 200}px`}
                        stroke={isActive ? '#22c55e' : '#9ca3af'}
                        strokeWidth="8"
                        strokeDasharray={isActive ? '0' : '20,10'}
                        className={isActive ? 'animate-pulse' : ''}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Flow Steps */}
            <div className="relative" style={{ zIndex: 2 }}>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
                    index <= currentStep ? 'scale-100 opacity-100' : 'scale-75 opacity-60'
                  }`}
                  style={{
                    left: `${(index % 3) * 33.33 + 16.66}%`,
                    top: `${Math.floor(index / 3) * 200 + 100}px`
                  }}
                >
                  {/* Step Circle */}
                  <div
                    className={`w-32 h-32 rounded-full border-8 ${getStepBorderColor(step)} bg-gradient-to-r ${getStepColor(step)} flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-all duration-300`}
                  >
                    {step.status === 'running' ? (
                      <div className="animate-spin">
                        <Loader className="h-8 w-8" />
                      </div>
                    ) : step.status === 'completed' ? (
                      <CheckCircle className="h-10 w-10" />
                    ) : (
                      getStepIcon(index)
                    )}
                  </div>

                  {/* Step Info Card */}
                  <div className={`mt-6 bg-white rounded-2xl border-4 border-black p-4 min-w-[280px] shadow-xl transform ${
                    step.status === 'running' ? 'animate-bounce' : ''
                  }`}>
                    <h4 className="font-black text-black text-lg text-center">
                      {step.name}
                      {step.status === 'running' && <span className="ml-2">⚡</span>}
                      {step.status === 'completed' && <span className="ml-2">✅</span>}
                    </h4>
                    <p className="text-gray-600 text-center font-bold mt-2">
                      {step.description}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="flex justify-center mt-3">
                      {step.status === 'completed' && (
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full font-black text-sm border-2 border-black">
                          DONE! 🎉
                        </span>
                      )}
                      {step.status === 'running' && (
                        <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm border-2 border-black animate-pulse">
                          WORKING... 🔥
                        </span>
                      )}
                      {step.status === 'pending' && (
                        <span className="bg-gray-300 text-gray-600 px-4 py-2 rounded-full font-black text-sm border-2 border-black">
                          WAITING... ⏳
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Floating Animation Elements */}
                  {step.status === 'running' && (
                    <div className="absolute -top-4 -right-4">
                      <Stars className="h-8 w-8 text-yellow-400 animate-spin" />
                    </div>
                  )}
                  {step.status === 'completed' && (
                    <div className="absolute -top-4 -right-4">
                      <Zap className="h-8 w-8 text-green-400 animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Flow Chart Height */}
            <div style={{ height: `${Math.ceil(steps.length / 3) * 200 + 100}px` }}></div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl border-8 border-white p-6 text-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h4 className="text-2xl font-black text-white mb-4">📊 PROGRESS</h4>
            <div className="text-5xl font-black text-white mb-2">
              {Math.round(((steps.filter(s => s.status === 'completed').length) / steps.length) * 100)}%
            </div>
            <p className="text-white font-bold">Complete!</p>
          </div>

          {/* Current Step */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl border-8 border-black p-6 text-center transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <h4 className="text-2xl font-black text-black mb-4">🔥 CURRENT</h4>
            <div className="text-xl font-black text-black mb-2">
              {steps[currentStep]?.name || 'Starting...'}
            </div>
            <p className="text-black font-bold">In Progress!</p>
          </div>

          {/* Time Remaining */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl border-8 border-white p-6 text-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h4 className="text-2xl font-black text-white mb-4">⏱️ ETA</h4>
            <div className="text-3xl font-black text-white mb-2">
              ~{(steps.length - steps.filter(s => s.status === 'completed').length) * 2} sec
            </div>
            <p className="text-white font-bold">Almost there!</p>
          </div>
        </div>

        {/* Fun Messages */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-3xl border-8 border-pink-400 p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h3 className="text-3xl font-black text-black mb-4">
              💭 WHAT'S HAPPENING?
            </h3>
            <div className="text-xl text-black font-bold">
              {steps.filter(s => s.status === 'completed').length === 0 && (
                <p>🚀 Starting the rocket engines! Getting ready to build something AMAZING!</p>
              )}
              {steps.filter(s => s.status === 'completed').length === 1 && (
                <p>📱 Setting up your app foundation! This is going to be EPIC!</p>
              )}
              {steps.filter(s => s.status === 'completed').length === 2 && (
                <p>🎨 Adding your custom colors and making it look FANTASTIC!</p>
              )}
              {steps.filter(s => s.status === 'completed').length === 3 && (
                <p>⚡ Injecting the website into Android! The magic is happening!</p>
              )}
              {steps.filter(s => s.status === 'completed').length === 4 && (
                <p>🔒 Setting up permissions and security! Keeping it SAFE and SOUND!</p>
              )}
              {steps.filter(s => s.status === 'completed').length === 5 && (
                <p>📦 Compiling the APK! Your app is almost ready to CONQUER the world!</p>
              )}
              {steps.filter(s => s.status === 'completed').length >= 6 && (
                <p>🎉 Final touches! Your MASTERPIECE is seconds away from completion!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingProgress;