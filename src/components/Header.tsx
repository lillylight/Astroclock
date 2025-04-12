'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isHome?: boolean;
  isHomePage?: boolean;
}

export function Header({ isHome, isHomePage = false }: HeaderProps) {
  const pathname = usePathname();
  const isHomeRoute = pathname === '/';

  // If isHome is explicitly provided, use it, otherwise infer from route
  const showHomeContent = isHome !== undefined ? isHome : (isHomePage || isHomeRoute);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {showHomeContent && (
        <>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">Astro Clock</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto px-4 sm:px-0">
            Discover your exact birth time through Vedic astrology
          </p>
        </>
      )}
    </div>
  );
}