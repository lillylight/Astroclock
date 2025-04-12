'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { WalletWrapper } from '../components/WalletWrapper';
import { BirthDetailsForm, BirthFormData } from '../components/BirthDetailsForm';
import { PaymentComponent } from '../components/PaymentComponent';
import { ReadingResults } from '../components/ReadingResults';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { Header } from '../components/Header';

export default function Home() {
  // Client-side state initialization
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'results'>('form');
  const [birthData, setBirthData] = useState<BirthFormData | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    // No automatic redirection or state restoration from localStorage
    console.log('Component mounted, starting fresh with form step');
  }, []);

  // Log wallet connection state and prevent automatic redirects
  useEffect(() => {
    if (isConnected) {
      console.log('Wallet is connected');
      console.log('Wallet connected, no automatic redirect');
    }
  }, [isConnected]);

  // Log current application state
  useEffect(() => {
    console.log('Current application state:', {
      currentStep,
      birthData: !!birthData,
    });
  }, [currentStep, birthData]);

  // Handle form submission
  const handleFormSubmit = useCallback((data: BirthFormData) => {
    setBirthData(data);
    setCurrentStep('payment');
  }, []);

  // Handle payment success
  const handlePaymentSuccess = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Call API to generate reading using the birthData
      const response = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthData }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);
        setCurrentStep('results');
      } else {
        console.error('Failed to generate reading');
      }
    } catch (error) {
      console.error('Error generating reading:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [birthData]);

  // Handle back button in results
  const handleBack = useCallback(() => {
    setCurrentStep('form');
    setBirthData(null);
    setPrediction('');
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WalletWrapper>
      <main className="min-h-screen bg-primary text-white flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative">
          <div className="w-full max-w-2xl mx-auto">
            {currentStep === 'form' && (
              <div className="animate-slide-left">
                <BirthDetailsForm onSubmit={handleFormSubmit} />
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="animate-slide-left">
                <PaymentComponent onPaymentSuccess={handlePaymentSuccess} />
              </div>
            )}

            {currentStep === 'results' && (
              <div className="animate-slide-left" key="results-container">
                {isGenerating ? (
                  <div className="max-w-md mx-auto bg-secondary bg-opacity-90 backdrop-filter backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-600/30 text-center">
                    <h2 className="text-2xl font-bold mb-6 font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">Generating Your Reading</h2>
                    <div className="flex justify-center items-center h-40 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50"></div>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
                        <div className="relative flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full border-t-2 border-b-2 border-l-2 border-indigo-400 animate-spin"></div>
                          <div className="w-20 h-20 rounded-full border-r-2 border-t-2 border-purple-400 animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                          <div className="w-16 h-16 bg-gray-800/80 rounded-full flex items-center justify-center absolute shadow-lg overflow-hidden border border-indigo-500/30">
                            {/* 3-body problem solar system animation */}
                            <div className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" 
                              style={{ 
                                animation: 'orbit1 8s linear infinite',
                              }}></div>
                            <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" 
                              style={{ 
                                animation: 'orbit2 12s linear infinite',
                              }}></div>
                            <div className="absolute w-1.5 h-1.5 bg-red-400 rounded-full shadow-lg shadow-red-400/50" 
                              style={{ 
                                animation: 'orbit3 10s linear infinite',
                              }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4">
                      Please wait while we analyze the cosmic energies...
                    </p>
                    <div className="mt-4 text-xs text-gray-500 animate-pulse">
                      This may take a few moments
                    </div>
                  </div>
                ) : (
                  <ReadingResults 
                    prediction={prediction} 
                    onNewReading={handleNewReading} 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </WalletWrapper>
  );
}