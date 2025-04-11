'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { WalletWrapper } from '../components/WalletWrapper';
import { BirthDetailsForm, BirthFormData } from '../components/BirthDetailsForm';
import { PaymentComponent } from '../components/PaymentComponent';
import { ReadingResults } from '../components/ReadingResults';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { Header } from '../components/Header';
import { EnhancedEntryMethod } from '../components/EnhancedEntryMethod';

export default function Home() {
  // Client-side state initialization
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'results'>('form');
  const [birthData, setBirthData] = useState<BirthFormData | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [entryMethod, setEntryMethod] = useState<'manual' | 'upload' | null>(null);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Load state from localStorage on mount
    try {
      const savedState = localStorage.getItem('astroClockState');
      if (savedState) {
        const { step, birthData: savedBirthData, prediction: savedPrediction } = JSON.parse(savedState);
        
        // Check if we have a prediction already generated
        const predictionGenerated = localStorage.getItem('predictionGenerated') === 'true';
        
        // If we're on the results page and have a prediction, use it
        if (step === 'results' && savedPrediction && predictionGenerated) {
          console.log('Using saved prediction from localStorage on page refresh');
          setCurrentStep(step);
          setBirthData(savedBirthData);
          setPrediction(savedPrediction);
        } else if (step !== 'results') {
          // For other steps, just restore the state
          setCurrentStep(step);
          setBirthData(savedBirthData);
          setPrediction(savedPrediction);
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);
  
  // Reset state when wallet connection changes
  useEffect(() => {
    if (mounted && isConnected) {
      // Check if we need to reset the state
      const shouldReset = localStorage.getItem('resetOnConnect') !== 'false';
      
      if (shouldReset) {
        // Reset to initial state
        setCurrentStep('form');
        setBirthData(null);
        setPrediction('');
        setEntryMethod(null);
        
        // Clear localStorage state
        localStorage.removeItem('astroClockState');
        
        // Set flag to prevent resetting again on reconnect
        localStorage.setItem('resetOnConnect', 'false');
      }
    }
    
    // When wallet disconnects, set flag to reset on next connect
    if (mounted && !isConnected) {
      localStorage.setItem('resetOnConnect', 'true');
    }
  }, [isConnected, mounted]);
  
  // Save state whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('astroClockState', JSON.stringify({
          step: currentStep,
          birthData,
          prediction
        }));
      } catch (error) {
        console.error('Error saving state to localStorage:', error);
      }
    }
  }, [currentStep, birthData, prediction, mounted]);
  
  // Prevent back navigation when on results page
  useEffect(() => {
    if (currentStep === 'results' && prediction) {
      // This handles the back button
      const handlePopState = (e: PopStateEvent) => {
        // Push another state to prevent going back
        window.history.pushState(null, '', window.location.pathname);
        // Show a message
        alert('Please use the "New Reading" button to start over.');
      };
      
      // Push a state so we have something to go back to
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [currentStep, prediction]);
  
  // If not mounted yet, return a placeholder that matches the server-rendered output
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8 sm:px-3 xs:px-2 sm:py-6 xs:py-4"></div>
      </main>
    );
  }
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleEntryMethodSelect = (method: 'manual' | 'upload') => {
    setEntryMethod(method);
  };

  const handleFormSubmit = (data: BirthFormData) => {
    setBirthData(data);
    setCurrentStep('payment');
  };
  
  const handlePaymentSuccess = async () => {
    console.log('Payment success callback triggered in page.tsx');
    
    // Set payment completed flag
    localStorage.setItem('paymentCompleted', 'true');
    localStorage.setItem('predictionGenerated', 'true');
    
    if (!birthData) {
      console.error('Birth data is missing, cannot generate reading');
      setPrediction('Error: Birth data is missing. Please start over and try again.');
      setCurrentStep('results');
      return;
    }
    
    // Check if we already have a saved prediction for this birth data
    try {
      const savedState = localStorage.getItem('astroClockState');
      if (savedState) {
        const { prediction: savedPrediction } = JSON.parse(savedState);
        
        // If we have a saved prediction, use it instead of making a new API call
        if (savedPrediction && savedPrediction.length > 0) {
          console.log('Using saved prediction from localStorage');
          setPrediction(savedPrediction);
          setCurrentStep('results');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking localStorage for saved prediction:', error);
      // Do not continue with API call if there's an error checking localStorage
      // Instead, show an error message and set to results step
      setPrediction('Error retrieving your saved prediction. Please try starting a new reading.');
      setCurrentStep('results');
      return;
    }
    
    console.log('Starting reading generation with birth data:', birthData);
    setIsGenerating(true);
    console.log('isGenerating set to true');
    
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add birth data as JSON
      formData.append('birthData', JSON.stringify(birthData));
      
      // Add photo if available
      if (birthData.method === 'upload' && birthData.photo) {
        formData.append('photo', birthData.photo);
        console.log('Photo attached to request');
      }
      
      console.log('Calling generate-reading API...');
      
      // Call the API route to generate the reading
      const response = await fetch('/api/generate-reading', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to generate reading: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Reading generated successfully');
      
      console.log('Setting prediction and changing to results step');
      setPrediction(data.prediction);
      setCurrentStep('results');
      console.log('Current step changed to results');
    } catch (error) {
      console.error('Error generating reading:', error);
      setPrediction('An error occurred while generating your reading. Please try again later.');
      setCurrentStep('results');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewReading = () => {
    // Clear previous data
    setBirthData(null);
    setPrediction('');
    setEntryMethod(null);
    setCurrentStep('form');
    
    // Clear the payment and prediction status in localStorage
    localStorage.removeItem('paymentCompleted');
    localStorage.removeItem('predictionGenerated');
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:px-3 sm:px-2 xs:px-1 md:py-6 sm:py-5 xs:py-4">
        <WalletWrapper />
        
        {showWelcome && (
          <WelcomeScreen 
            onComplete={handleWelcomeComplete} 
            isWalletConnected={isConnected}
          />
        )}
        
        {/* Header is now included in each component */}
        
        <div className="flex flex-col justify-center items-center min-h-[70vh] md:min-h-[65vh] sm:min-h-[60vh] xs:min-h-[50vh]">
          {!isConnected ? (
            <div className="max-w-md mx-auto md:max-w-sm sm:max-w-xs xs:max-w-[90%]">
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 md:p-5 sm:p-4 xs:p-3 rounded-2xl md:rounded-xl sm:rounded-lg xs:rounded text-center shadow-lg border border-indigo-500/30 backdrop-filter backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3 md:mb-2 sm:mb-1.5 xs:mb-1">
                  <svg className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 xs:w-3.5 xs:h-3.5 text-yellow-300 mr-2 md:mr-1.5 sm:mr-1 xs:mr-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-yellow-300 font-medium md:text-sm sm:text-xs xs:text-[10px]">
                    Wallet Connection Required
                  </p>
                </div>
                <p className="text-gray-300 text-sm md:text-xs sm:text-[10px] xs:text-[9px]">
                  Please connect your wallet using the button in the top right corner to access Astro Clock.
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentStep === 'form' && entryMethod === null && !showWelcome && (
              <>
                <Header isHomePage={true} />
                <EnhancedEntryMethod onSelect={handleEntryMethodSelect} />
              </>
            )}
            
            {currentStep === 'form' && entryMethod !== null && (
              <div className="animate-slide-left">
                <BirthDetailsForm 
                  onSubmit={handleFormSubmit} 
                  initialMethod={entryMethod}
                />
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
                  <div className="max-w-md mx-auto md:max-w-sm sm:max-w-xs xs:max-w-[90%] bg-secondary bg-opacity-90 backdrop-filter backdrop-blur-md p-8 md:p-6 sm:p-4 xs:p-3 rounded-3xl md:rounded-2xl sm:rounded-xl xs:rounded-lg shadow-2xl border border-gray-600/30 text-center">
                    <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold mb-6 md:mb-5 sm:mb-4 xs:mb-3 font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">Generating Your Reading</h2>
                    <div className="flex justify-center items-center h-40 md:h-32 sm:h-24 xs:h-20 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50"></div>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
                        <div className="relative flex items-center justify-center">
                          <div className="w-24 h-24 md:w-20 md:h-20 sm:w-16 sm:h-16 xs:w-12 xs:h-12 rounded-full border-t-2 border-b-2 border-l-2 border-indigo-400 animate-spin"></div>
                          <div className="w-20 h-20 md:w-16 md:h-16 sm:w-12 sm:h-12 xs:w-10 xs:h-10 rounded-full border-r-2 border-t-2 border-purple-400 animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                          <div className="w-16 h-16 md:w-12 md:h-12 sm:w-10 sm:h-10 xs:w-8 xs:h-8 bg-gray-800/80 rounded-full flex items-center justify-center absolute shadow-lg overflow-hidden border border-indigo-500/30">
                            {/* 3-body problem solar system animation */}
                            <div className="absolute w-2 h-2 md:w-1.5 md:h-1.5 sm:w-1 sm:h-1 xs:w-0.5 xs:h-0.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" 
                              style={{ 
                                animation: 'orbit1 8s linear infinite',
                              }}></div>
                            <div className="absolute w-1.5 h-1.5 md:w-1 md:h-1 sm:w-0.75 sm:h-0.75 xs:w-0.5 xs:h-0.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" 
                              style={{ 
                                animation: 'orbit2 12s linear infinite',
                              }}></div>
                            <div className="absolute w-1.5 h-1.5 md:w-1 md:h-1 sm:w-0.75 sm:h-0.75 xs:w-0.5 xs:h-0.5 bg-red-400 rounded-full shadow-lg shadow-red-400/50" 
                              style={{ 
                                animation: 'orbit3 10s linear infinite',
                              }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4 md:mt-3 sm:mt-2 xs:mt-1.5 md:text-sm sm:text-xs xs:text-[10px]">
                      Please wait while we analyze the cosmic energies...
                    </p>
                    <div className="mt-4 md:mt-3 sm:mt-2 xs:mt-1.5 text-xs md:text-[10px] sm:text-[9px] xs:text-[8px] text-gray-500 animate-pulse">
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}