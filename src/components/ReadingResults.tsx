'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadingResultsProps {
  prediction: string;
  onNewReading: () => void;
}

export function ReadingResults({ prediction, onNewReading }: ReadingResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Log when the component is rendered
  console.log('ReadingResults component rendered with prediction:', prediction ? 'Prediction available' : 'No prediction');

  const handleDownload = () => {
    // Create a blob with the prediction text
    const blob = new Blob([prediction], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'astro-clock-reading.txt';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(prediction)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleShareToX = () => {
    const text = encodeURIComponent("I just discovered my exact birth time with Astro Clock! Check it out:");
    const url = encodeURIComponent("https://astroclock.app");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareToFacebook = () => {
    const url = encodeURIComponent("https://astroclock.app");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };
  
  if (!mounted) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const shareMenuVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -5,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <>
      <Header isHomePage={false} />
      
      {/* Background glow effect */}
      <div className="relative max-w-2xl mx-auto mt-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-[40px] blur-3xl opacity-50 transform scale-75"></div>
        </div>
        
        {/* Main container with glass effect */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative backdrop-blur-xl bg-gray-900/60 border border-gray-700/50 rounded-[32px] p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle background patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300">
                Your Birth Time Prediction
              </span>
            </motion.h2>
            
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/70 p-8 rounded-3xl mb-8 whitespace-pre-wrap shadow-inner border border-gray-700/50 backdrop-blur-sm"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {prediction.split('\n').map((paragraph, index) => (
                    <motion.p 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      className="mb-4 last:mb-0 text-gray-100"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              )}
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleDownload}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-4 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-600 hover:to-indigo-600 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(129,140,248,0.5)] flex items-center shadow-lg text-sm font-medium border border-purple-500/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button
                      onClick={toggleShareMenu}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="py-2 px-4 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-600 hover:to-purple-600 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(129,140,248,0.5)] flex items-center shadow-lg text-sm font-medium border border-indigo-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share
                    </motion.button>
                  
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div 
                          variants={shareMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full mt-2 flex flex-col bg-gray-800/95 rounded-xl shadow-xl border border-gray-700/50 p-2 w-48 z-10 backdrop-blur-sm"
                        >
                          <motion.button
                            onClick={handleCopyToClipboard}
                            whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                            className="flex items-center p-2 hover:bg-gray-700/60 rounded-lg text-left text-sm transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            {copySuccess || 'Copy to clipboard'}
                          </motion.button>
                          
                          <motion.button
                            onClick={handleShareToX}
                            whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                            className="flex items-center p-2 hover:bg-gray-700/60 rounded-lg text-left text-sm transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Share on X
                          </motion.button>
                          
                          <motion.button
                            onClick={handleShareToFacebook}
                            whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                            className="flex items-center p-2 hover:bg-gray-700/60 rounded-lg text-left text-sm transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Share on Facebook
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <motion.button
                  onClick={onNewReading}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-2 px-4 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-600 hover:to-indigo-600 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(129,140,248,0.5)] flex items-center shadow-lg text-sm font-medium border border-purple-500/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  New Reading
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-400">
                This is an experimental service and results may vary. Use for entertainment purposes only.
              </p>
            </motion.div>
            
            {/* Subtle animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 - 50 + '%', 
                    y: Math.random() * 100 - 50 + '%',
                    opacity: Math.random() * 0.5 + 0.3,
                    scale: Math.random() * 0.6 + 0.2
                  }}
                  animate={{ 
                    opacity: [null, 0.2, 0.8, 0.2],
                    scale: [null, 0.6, 1, 0.6]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + Math.random() * 5,
                    delay: Math.random() * 5
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
