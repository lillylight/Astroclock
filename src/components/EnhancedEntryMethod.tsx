'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EnhancedEntryMethodProps {
  onSelect: (method: 'manual' | 'upload') => void;
}

export function EnhancedEntryMethod({ onSelect }: EnhancedEntryMethodProps) {
  const [hoverManual, setHoverManual] = useState(false);
  const [hoverUpload, setHoverUpload] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto px-4">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-[40px] blur-3xl opacity-50 transform scale-75"></div>
      </div>
      
      {/* Main container with glass effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="backdrop-blur-xl bg-gray-900/40 border border-gray-700/30 rounded-[32px] p-4 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300">
              Choose Entry Method
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Manual Entry Option */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={() => onSelect('manual')}
              onMouseEnter={() => setHoverManual(true)}
              onMouseLeave={() => setHoverManual(false)}
              className="relative group"
              aria-label="Choose manual entry method"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
              
              <div className="bg-gray-800/40 backdrop-blur-md hover:bg-gray-800/60 p-4 md:p-6 rounded-2xl transition-all duration-500 border border-gray-700/50 group-hover:border-indigo-500/30 relative overflow-hidden shadow-lg">
                {/* 3D Icon Container */}
                <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4" aria-hidden="true">
                  {/* Base circle with gradient */}
                  <motion.div 
                    animate={{ 
                      boxShadow: hoverManual 
                        ? '0 0 25px 5px rgba(129, 140, 248, 0.3)' 
                        : '0 0 15px 2px rgba(129, 140, 248, 0.15)'
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-full"
                  ></motion.div>
                  
                  {/* Gold rim */}
                  <motion.div 
                    animate={{ 
                      scale: hoverManual ? 1.03 : 1,
                      rotate: hoverManual ? 5 : 0
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    className="absolute inset-0 border-2 border-amber-400/60 rounded-full"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(217,119,6,0.1) 100%)'
                    }}
                  ></motion.div>
                  
                  {/* Icon */}
                  <motion.div 
                    animate={{ 
                      scale: hoverManual ? 1.1 : 1,
                      y: hoverManual ? -2 : 0
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-indigo-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 5L18 7.5M18 7.5L15.5 10M18 7.5H10M10 16.5L7.5 14M7.5 14L10 11.5M7.5 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 3.5V3.5C16.1421 3.5 19.5 6.85786 19.5 11V13C19.5 17.1421 16.1421 20.5 12 20.5V20.5C7.85786 20.5 4.5 17.1421 4.5 13V11C4.5 6.85786 7.85786 3.5 12 3.5V3.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </motion.div>
                  
                  {/* Highlight overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-50 h-1/2"></div>
                </div>
                
                {/* Text */}
                <motion.span 
                  animate={{ y: hoverManual ? -2 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="block font-medium text-base md:text-lg text-center text-white mb-1"
                >
                  Enter Manually
                </motion.span>
                <motion.p 
                  animate={{ opacity: hoverManual ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs md:text-sm text-center text-gray-300"
                >
                  Input your physical traits
                </motion.p>
              </div>
            </motion.button>
            
            {/* Upload Photo Option */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onClick={() => onSelect('upload')}
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
              className="relative group"
              aria-label="Choose photo upload method"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
              
              <div className="bg-gray-800/40 backdrop-blur-md hover:bg-gray-800/60 p-4 md:p-6 rounded-2xl transition-all duration-500 border border-gray-700/50 group-hover:border-indigo-500/30 relative overflow-hidden shadow-lg">
                {/* 3D Icon Container */}
                <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4" aria-hidden="true">
                  {/* Base circle with gradient */}
                  <motion.div 
                    animate={{ 
                      boxShadow: hoverUpload 
                        ? '0 0 25px 5px rgba(129, 140, 248, 0.3)' 
                        : '0 0 15px 2px rgba(129, 140, 248, 0.15)'
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-full"
                  ></motion.div>
                  
                  {/* Gold rim */}
                  <motion.div 
                    animate={{ 
                      scale: hoverUpload ? 1.03 : 1,
                      rotate: hoverUpload ? -5 : 0
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    className="absolute inset-0 border-2 border-amber-400/60 rounded-full"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(217,119,6,0.1) 100%)'
                    }}
                  ></motion.div>
                  
                  {/* Icon */}
                  <motion.div 
                    animate={{ 
                      scale: hoverUpload ? 1.1 : 1,
                      y: hoverUpload ? -2 : 0
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-indigo-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  
                  {/* Highlight overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-50 h-1/2"></div>
                </div>
                
                {/* Text */}
                <motion.span 
                  animate={{ y: hoverUpload ? -2 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="block font-medium text-base md:text-lg text-center text-white mb-1"
                >
                  Upload Photo
                </motion.span>
                <motion.p 
                  animate={{ opacity: hoverUpload ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs md:text-sm text-center text-gray-300"
                >
                  We'll analyze your image
                </motion.p>
              </div>
            </motion.button>
          </div>
          
          {/* Subtle animated stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
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
  );
}