'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isHomePage: boolean;
  className?: string;
}

export function Header({ isHomePage }: HeaderProps) {
  const pathname = usePathname();
  // Determine if we're on the home page
  const isHome = isHomePage !== undefined ? isHomePage : pathname === '/' || pathname === '/nako';
  
  return (
    <div className="text-center mb-4 md:mb-8 mt-4 md:mt-8 flex flex-col items-center">
      <div 
        className="relative mb-4 md:mb-6 cursor-pointer" 
        onClick={() => window.location.href = '/'} 
        role="button"
        aria-label="Go to homepage"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.location.href = '/';
          }
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50" aria-hidden="true"></div>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center relative shadow-2xl overflow-hidden border border-indigo-500/30 animate-float">
          {/* 3-body problem solar system animation */}
          <div className="absolute w-2 md:w-3 h-2 md:h-3 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" 
            style={{ 
              animation: 'orbit1 8s linear infinite',
            }}
            aria-hidden="true"
          ></div>
          <div className="absolute w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" 
            style={{ 
              animation: 'orbit2 12s linear infinite',
            }}
            aria-hidden="true"
          ></div>
          <div className="absolute w-1.5 md:w-2 h-1.5 md:h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50" 
            style={{ 
              animation: 'orbit3 10s linear infinite',
            }}
            aria-hidden="true"
          ></div>
          
          <style jsx>{`
            @keyframes orbit1 {
              0% { transform: translate(0, 0) }
              25% { transform: translate(3px, 3px) }
              50% { transform: translate(-2px, 3px) }
              75% { transform: translate(-3px, -2px) }
              100% { transform: translate(0, 0) }
            }
            @keyframes orbit2 {
              0% { transform: translate(3px, 2px) }
              33% { transform: translate(-3px, 3px) }
              66% { transform: translate(2px, -3px) }
              100% { transform: translate(3px, 2px) }
            }
            @keyframes orbit3 {
              0% { transform: translate(-2px, -2px) }
              50% { transform: translate(3px, -2px) }
              100% { transform: translate(-2px, -2px) }
            }
          `}</style>
        </div>
      </div>
      
      {isHome && (
        <>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">Astro Clock</h1>
          <p className="text-base md:text-xl text-white max-w-md mx-auto px-4">
            Discover your exact birth time through Vedic astrology
          </p>
        </>
      )}
    </div>
  );
}