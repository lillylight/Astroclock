'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800/50 py-2 sm:py-3 mt-auto w-full">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 justify-center sm:justify-start w-full sm:w-auto">
            <span
              className="text-xs sm:text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              Astro Clock
            </span>
            <span className="text-gray-500 text-xs hidden sm:inline">|</span>
            <p className="text-gray-400 text-xs hidden sm:inline truncate max-w-[200px] md:max-w-none">
              Discover your exact birth time through Vedic astrology
            </p>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs justify-center sm:justify-end w-full sm:w-auto">
            <Link href="/privacy" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
              Terms
            </Link>
            <a 
              href="mailto:magusdalochi@yahoo.com" 
              className="text-gray-400 hover:text-indigo-300 transition-colors duration-200"
            >
              Contact
            </a>
            <span className="text-gray-500 text-[10px]">© {currentYear}</span>
          </div>
        </div>
        
        <div className="w-full text-center mt-1">
          <p className="text-gray-500 text-[8px] sm:text-[10px] px-2">
            For entertainment purposes only. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
