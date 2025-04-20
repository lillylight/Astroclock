'use client';

import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
  isWalletConnected: boolean;
}

export function WelcomeScreen({ onComplete, isWalletConnected }: WelcomeScreenProps) {
  // Use useEffect to initialize state on the client side only
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rotation, setRotation] = useState(0);
  
  // Only run client-side
  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 6) % 360);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Define the animation keyframes for the 3-body problem
  const animationStyles = `
    @keyframes orbit1 {
      0% { transform: translate(0, 0) }
      25% { transform: translate(2px, 2px) }
      50% { transform: translate(-1px, 2px) }
      75% { transform: translate(-2px, -1px) }
      100% { transform: translate(0, 0) }
    }
    @keyframes orbit2 {
      0% { transform: translate(2px, 1px) }
      33% { transform: translate(-2px, 2px) }
      66% { transform: translate(1px, -2px) }
      100% { transform: translate(2px, 1px) }
    }
    @keyframes orbit3 {
      0% { transform: translate(-1px, -1px) }
      50% { transform: translate(2px, -1px) }
      100% { transform: translate(-1px, -1px) }
    }
  `;

  // Don't render anything until client-side
  if (!mounted) {
    return null;
  }

  const handleWelcomeClick = () => {
    setShowWelcome(false);
    setStep(1);
  };

  const handleNextStep = () => {
    // Allow proceeding even if wallet is not connected
    onComplete();
  };

  if (showWelcome) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
        onClick={handleWelcomeClick}
      >
        <style jsx>{animationStyles}</style>
        <div className="bg-secondary bg-opacity-80 backdrop-filter backdrop-blur-md p-6 rounded-3xl max-w-[280px] w-full h-[360px] flex flex-col justify-center animate-slide-left text-center shadow-2xl border border-gray-600/50">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center relative shadow-lg overflow-hidden">
              {/* 3-body problem solar system animation */}
              <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full" 
                style={{ 
                  animation: 'orbit1 8s linear infinite',
                }}></div>
              <div className="absolute w-1 h-1 bg-blue-400 rounded-full" 
                style={{ 
                  animation: 'orbit2 12s linear infinite',
                }}></div>
              <div className="absolute w-1 h-1 bg-red-400 rounded-full" 
                style={{ 
                  animation: 'orbit3 10s linear infinite',
                }}></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 font-serif">Astro Clock</h2>
          <p className="text-md text-gray-300 mb-4">
            Discover your exact birth time through Vedic astrology
          </p>
          <div className="mt-4 bg-gray-700 bg-opacity-50 py-2 px-3 rounded-full text-xs text-gray-300 inline-block">
            Click anywhere to continue
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
        onClick={handleNextStep}
      >
        <style jsx>{animationStyles}</style>
        <div 
          className="bg-secondary p-5 rounded-2xl max-w-sm w-full animate-slide-left shadow-2xl border border-gray-700"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the content from closing
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-serif">How It Works</h2>
          </div>
          
          {/* Logo removed from How It Works screen as requested */}
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start bg-gray-800 bg-opacity-50 p-2 rounded-xl hover:bg-opacity-70 transition-all">
              <div className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-2 shadow-md">
                <span className="font-medium text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium font-serif text-sm">Enter Your Birth Details</h3>
                <p className="text-gray-300 text-xs">
                  Provide your birth location, date, and approximate time of day.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-800 bg-opacity-50 p-2 rounded-xl hover:bg-opacity-70 transition-all">
              <div className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-2 shadow-md">
                <span className="font-medium text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium font-serif text-sm">Share Your Physical Traits</h3>
                <p className="text-gray-300 text-xs">
                  Enter your physical characteristics for astrological analysis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-800 bg-opacity-50 p-2 rounded-xl hover:bg-opacity-70 transition-all">
              <div className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-2 shadow-md">
                <span className="font-medium text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium font-serif text-sm">Complete Payment</h3>
                <p className="text-gray-300 text-xs">
                  Pay $1 USDC to receive your personalized birth time prediction.
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-800 bg-opacity-50 p-2 rounded-xl hover:bg-opacity-70 transition-all">
              <div className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-2 shadow-md">
                <span className="font-medium text-sm">4</span>
              </div>
              <div>
                <h3 className="font-medium font-serif text-sm">Get Your Prediction</h3>
                <p className="text-gray-300 text-xs">
                  Receive a detailed analysis of your exact birth time based on Vedic astrology.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              handleNextStep(); // Call the next step handler directly
            }}
            
            className="w-full py-3 rounded-full transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_15px_rgba(129,140,248,0.5)] font-medium shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return null;
}
