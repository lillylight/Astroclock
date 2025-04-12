'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800/50 py-3 mt-auto sm:py-2">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col xs:flex-row flex-wrap items-center justify-between gap-2 xs:gap-0">
          <div className="flex items-center space-x-2 w-full xs:w-auto justify-center xs:justify-start">
            <span
              className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 sm:text-xs cursor-pointer whitespace-nowrap"
              onClick={() => window.location.href = '/'}
            >
              Astro Clock
            </span>
            <span className="text-gray-500 text-xs hidden xs:inline">|</span>
            <p className="text-gray-400 text-xs hidden xs:inline line-clamp-1 max-w-[180px] sm:max-w-none">
              Discover your exact birth time through Vedic astrology
            </p>
          </div>
          
          <div className="flex items-center space-x-3 xs:space-x-4 text-xs sm:space-x-2 w-full xs:w-auto justify-center xs:justify-end">
            <Link href="/privacy" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 whitespace-nowrap">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 whitespace-nowrap">
              Terms
            </Link>
            <a 
              href="mailto:magusdalochi@yahoo.com" 
              className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 whitespace-nowrap"
            >
              Contact
            </a>
            <span className="text-gray-500 text-xs sm:text-[10px] whitespace-nowrap">© {currentYear}</span>
          </div>
        </div>
        
        <div className="w-full text-center mt-2">
          <p className="text-gray-500 text-[10px] sm:text-[8px]">
            For entertainment purposes only. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
