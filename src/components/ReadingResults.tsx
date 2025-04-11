'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadingResultsProps {
  prediction: string;
  onNewReading: () => void;
}

export function ReadingResults({ prediction, onNewReading }: ReadingResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
      {/* Main content container with responsive dimensions */}
      <div className="relative max-w-2xl mx-auto px-4 md:px-3 sm:px-2 flex items-center justify-center py-16 md:py-12 sm:py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-[40px] blur-3xl opacity-50 transform scale-75"></div>
        </div>
        
        {/* Main container with glass effect */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative backdrop-blur-xl bg-gray-900/60 border border-gray-700/50 rounded-[32px] md:rounded-[28px] sm:rounded-[24px] p-6 md:p-5 sm:p-4 shadow-2xl overflow-visible w-full"
        >
          {/* Subtle background patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 md:w-32 md:h-32 sm:w-24 sm:h-24 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 md:w-32 md:h-32 sm:w-24 sm:h-24 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-2xl sm:text-xl font-bold text-center mb-8 md:mb-6 sm:mb-4 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300">
                Your Birth Time Prediction
              </span>
            </motion.h2>
            
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/70 p-6 md:p-5 sm:p-4 rounded-3xl md:rounded-2xl sm:rounded-xl whitespace-pre-wrap shadow-inner border border-gray-700/50 backdrop-blur-sm mb-6 md:mb-5 sm:mb-4"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-40 md:h-32 sm:h-24">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-10 md:w-10 sm:h-8 sm:w-8 border-t-2 border-b-2 border-indigo-400"></div>
                </div>
              ) : (
                <div 
                  ref={contentRef}
                  className="prose prose-invert max-w-none overflow-y-auto max-h-[400px] md:max-h-[350px] sm:max-h-[250px] pr-2 break-words scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700"
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#6366f1 #374151'
                  }}
                >
                  <div className="text-white whitespace-pre-line md:text-sm sm:text-xs">
                    {prediction}
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 md:gap-3 sm:gap-2 mt-6 md:mt-5 sm:mt-4 max-w-md mx-auto"
            >
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="py-2 px-4 md:py-1.5 md:px-3 sm:py-1 sm:px-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl md:rounded-lg sm:rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(129,140,248,0.6)] flex items-center shadow-lg text-sm md:text-xs sm:text-xs font-medium border border-purple-500/30 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download
              </motion.button>
              
              <div className="relative">
                <motion.button
                  onClick={toggleShareMenu}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-4 md:py-1.5 md:px-3 sm:py-1 sm:px-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl md:rounded-lg sm:rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(129,140,248,0.6)] flex items-center shadow-lg text-sm md:text-xs sm:text-xs font-medium border border-indigo-500/30 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
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
                      className="absolute top-full mt-3 md:mt-2 sm:mt-1.5 flex flex-col bg-gray-800/95 rounded-xl md:rounded-lg sm:rounded-md shadow-xl border border-gray-700/50 p-3 md:p-2.5 sm:p-2 w-52 md:w-48 sm:w-44 z-10 backdrop-blur-sm"
                    >
                      <motion.button
                        onClick={handleCopyToClipboard}
                        whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                        className="flex items-center p-3 md:p-2.5 sm:p-2 hover:bg-gray-700/60 rounded-lg md:rounded-md sm:rounded-md text-left text-sm md:text-xs sm:text-xs transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-4 md:w-4 sm:h-3.5 sm:w-3.5 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        {copySuccess || 'Copy to clipboard'}
                      </motion.button>
                      
                      <motion.button
                        onClick={handleShareToX}
                        whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                        className="flex items-center p-3 md:p-2.5 sm:p-2 hover:bg-gray-700/60 rounded-lg md:rounded-md sm:rounded-md text-left text-sm md:text-xs sm:text-xs transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-4 md:w-4 sm:h-3.5 sm:w-3.5 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Share on X
                      </motion.button>
                      
                      <motion.button
                        onClick={handleShareToFacebook}
                        whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                        className="flex items-center p-3 md:p-2.5 sm:p-2 hover:bg-gray-700/60 rounded-lg md:rounded-md sm:rounded-md text-left text-sm md:text-xs sm:text-xs transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-4 md:w-4 sm:h-3.5 sm:w-3.5 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Share on Facebook
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                onClick={onNewReading}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="py-2 px-4 md:py-1.5 md:px-3 sm:py-1 sm:px-2 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-400 hover:to-orange-300 rounded-xl md:rounded-lg sm:rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.6)] flex items-center shadow-lg text-sm md:text-xs sm:text-xs font-medium border border-pink-500/30 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                New Reading
              </motion.button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6 md:mt-5 sm:mt-4 text-center"
            >
              <p className="text-sm md:text-xs sm:text-[10px] text-gray-400">
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
                  className="absolute w-1 h-1 bg-white rounded-full md:w-0.8 md:h-0.8 sm:w-0.5 sm:h-0.5"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}