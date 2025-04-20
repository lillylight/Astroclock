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
    <div className="text-center mb-8 mt-8 flex flex-col items-center">
      <div className="relative mb-6 cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center relative shadow-2xl overflow-hidden border border-indigo-500/30">
          {/* Ultra-clear, white moon icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44" height="44" style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <radialGradient id="moonGlowWhite" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="80%" stop-color="#f3f4f6" />
                <stop offset="100%" stop-color="#e5e7eb" />
              </radialGradient>
              <filter id="moonOuterGlowWhite" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#fff" flood-opacity="0.33" />
              </filter>
            </defs>
            <circle cx="24" cy="24" r="18" fill="url(#moonGlowWhite)" stroke="#f3f4f6" stroke-width="2" filter="url(#moonOuterGlowWhite)" />
            <path d="M42 24c0 9.94-8.06 18-18 18a18.03 18.03 0 0 1-7.6-1.62c8.1-1.13 14.36-8.08 14.36-16.38 0-4.94-2.22-9.36-5.7-12.32A18.02 18.02 0 0 1 24 6c9.94 0 18 8.06 18 18z" fill="#e5e7eb" opacity="0.92" />
            <circle cx="29" cy="18.5" r="2.7" fill="#f3f4f6" stroke="#bfc3c7" stroke-width="1.1" />
            <ellipse cx="18" cy="28.2" rx="1.7" ry="1.2" fill="#e5e7eb" stroke="#bfc3c7" stroke-width="0.7" />
            <ellipse cx="22.7" cy="32.5" rx="1.3" ry="0.8" fill="#e5e7eb" stroke="#bfc3c7" stroke-width="0.5" />
            <ellipse cx="33.3" cy="26.5" rx="1.1" ry="0.7" fill="#e5e7eb" stroke="#bfc3c7" stroke-width="0.5" />
            <ellipse cx="26.5" cy="14.5" rx="0.7" ry="0.5" fill="#e5e7eb" stroke="#bfc3c7" stroke-width="0.3" />
          </svg>
        </div>
      </div>
      
      {isHome && (
        <>
          <h1 className="text-5xl font-bold mb-4 font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">Astro Clock</h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Discover your exact birth time through Vedic astrology
          </p>
        </>
      )}
    </div>
  );
}
