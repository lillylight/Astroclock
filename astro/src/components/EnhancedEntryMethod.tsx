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
        className="backdrop-blur-xl bg-gray-900/40 border border-gray-700/30 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300">
              Choose Entry Method
            </span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Manual Entry Option */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoverManual(true)}
              onMouseLeave={() => setHoverManual(false)}
              onClick={() => onSelect('manual')}
            >
              <div className="relative mb-3 w-20 h-20 sm:w-24 sm:h-24">
                <motion.div 
                  animate={{ 
                    scale: hoverManual ? [1, 1.05, 1] : 1,
                    borderColor: hoverManual ? "rgba(168, 85, 247, 0.8)" : "rgba(168, 85, 247, 0.4)"
                  }}
                  transition={{ duration: 0.5, repeat: hoverManual ? Infinity : 0 }}
                  className="absolute inset-0 border-2 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-filter backdrop-blur-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-center font-medium text-white text-sm sm:text-base">Enter Manually</h3>
              <p className="text-center text-gray-400 text-xs sm:text-sm mt-1 px-1">Input your birth details directly</p>
            </motion.div>

            {/* Photo Upload Option */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
              onClick={() => onSelect('upload')}
            >
              <div className="relative mb-3 w-20 h-20 sm:w-24 sm:h-24">
                <motion.div 
                  animate={{ 
                    scale: hoverUpload ? [1, 1.05, 1] : 1,
                    borderColor: hoverUpload ? "rgba(168, 85, 247, 0.8)" : "rgba(168, 85, 247, 0.4)"
                  }}
                  transition={{ duration: 0.5, repeat: hoverUpload ? Infinity : 0 }}
                  className="absolute inset-0 border-2 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-filter backdrop-blur-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-center font-medium text-white text-sm sm:text-base">Upload Photo</h3>
              <p className="text-center text-gray-400 text-xs sm:text-sm mt-1 px-1">We'll analyze your birth chart</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-xs sm:text-sm px-2">
              Choose how you'd like to provide your birth details for the most accurate reading
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
  );
}
