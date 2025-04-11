'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
  ConnectWalletText,
} from '@coinbase/onchainkit/wallet';
import { FundButton } from '@coinbase/onchainkit/fund';
import {
  Avatar,
  Name,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

export function WalletComponent() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dropDirection, setDropDirection] = useState<'down' | 'up'>('down');
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set flag to reset state on wallet connection
  useEffect(() => {
    if (!isConnected && mounted) {
      // Set flag to reset on connect
      localStorage.setItem('resetOnConnect', 'true');
    }
  }, [isConnected, mounted]);

  // Determine if dropdown should appear above or below based on screen position
  useEffect(() => {
    if (!mounted) return;

    const checkPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // If there's less than 250px below the button, show dropdown above
        setDropDirection(spaceBelow < 250 ? 'up' : 'down');
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    window.addEventListener('scroll', checkPosition);

    return () => {
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition);
    };
  }, [mounted]);

  useEffect(() => {
    if (isConnected) {
      // Removed logic for automatic redirection to the payment page
      console.log('Wallet is connected');
    } else {
      // Reset the redirection flag when disconnected
      localStorage.removeItem('hasRedirected');
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      // Check if the user is on the prediction page
      const currentPath = window.location.pathname;

      if (currentPath === '/prediction') {
        console.log('User is on the prediction page');
        // Add logic to handle prediction page behavior
      } else {
        console.log('User navigated away from the prediction page');
      }
    }
  }, [isConnected]);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  if (!mounted) {
    return (
      <div className="flex justify-end p-4 relative sm:p-2">
        <div className="absolute right-4 top-4 w-40 h-12 pointer-events-none sm:w-32 sm:h-10">
          <div className="absolute inset-0 rounded-full blur-md opacity-20 bg-gradient-to-r from-gray-400 to-gray-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end p-4 relative sm:p-2 z-40">
      {/* Subtle background glow effect - positioned behind the button */}
      <div className="absolute right-4 top-4 w-40 h-12 pointer-events-none sm:w-32 sm:h-10">
        <div className={`absolute inset-0 rounded-full blur-md opacity-20 ${isConnected ? 'bg-gradient-to-r from-green-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>
      </div>
      
      <div ref={buttonRef} className="relative">
        <Wallet>
          <ConnectWallet 
            className={`
              ${isConnected 
                ? 'bg-gradient-to-r from-green-600 to-indigo-600 border border-green-400/30' 
                : 'bg-gradient-to-r from-indigo-600 to-green-600 border border-indigo-500/30'
              } 
              transition-all
              duration-300
              ease-in-out
              hover:translate-y-[-2px]
              hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]
              rounded-full 
              py-2
              px-3
              md:py-2.5
              md:px-5
              shadow-lg
              relative
              z-10
              text-sm
              md:text-base
            `}
            aria-label={isConnected ? "Your connected wallet" : "Connect wallet"}
          >
            {!isConnected && (
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1.05, 0.95]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2
                }}
                className="mr-2"
                aria-hidden="true"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M19 7H5C3.89543 7 3 7.89543 3 9V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="white"/>
                  <path d="M3 10L12 3L21 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
            {isConnected && (
              <div className="mr-2 relative" aria-hidden="true">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute w-2 h-2 bg-green-400 rounded-full right-0 top-0 opacity-70"
                  aria-hidden="true"
                ></motion.div>
                <div className="absolute w-2 h-2 bg-green-500 rounded-full right-0 top-0" aria-hidden="true"></div>
              </div>
            )}
            <Avatar className="h-5 w-5 md:h-6 md:w-6" />
            <ConnectWalletText>
              {isConnected ? '' : 'Connect Wallet'}
            </ConnectWalletText>
            <Name className="font-medium text-sm md:text-base truncate max-w-[60px] md:max-w-full" />
          </ConnectWallet>
          
          <WalletDropdown 
            className={`
              !bg-transparent 
              !shadow-none 
              !border-0 
              !overflow-visible 
              w-[90vw] 
              max-w-[230px] 
              md:max-w-[280px] 
              left-1/2 
              -translate-x-1/2 
              md:left-auto 
              md:translate-x-0 
              md:right-0 
              ${dropDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} 
              z-50
            `}
          >
            <div className="backdrop-blur-md bg-gray-900/90 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              {/* Subtle background patterns - reduced intensity */}
              <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-indigo-500 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full blur-xl"></div>
              </div>
              
              <div className="px-3 pt-3 pb-2 md:px-4 md:pt-4 md:pb-3 bg-[#1A1B1E] relative">
                <div className="flex flex-col items-center mb-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">BALANCE</span>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9975 2L12 9.01685L17.1152 12L12 14.9895L11.9975 22L4.5 12L11.9975 2Z" fill="currentColor"/>
                      <path d="M12 2L19.5 12L12 22L12 15.0105L16.5 12L12 9.01685V2Z" fill="currentColor" fillOpacity="0.6"/>
                    </svg>
                    <span className="text-xl md:text-2xl font-bold text-white">0.0001 ETH</span>
                  </div>
                </div>
              </div>
              
              <div className="py-1 px-1 md:py-2 md:px-2 relative z-10">
                <div className="mb-2">
                  <FundButton 
                    className="w-full py-2 md:py-3 rounded-xl flex items-center justify-center bg-[#1A1B1E] hover:!bg-gray-700/90 text-white font-medium my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px] text-sm md:text-base"
                    text="Add Funds"
                    openIn="tab"
                  />
                </div>
                
                <WalletDropdownLink
                  className="py-2 md:py-3 rounded-xl flex items-center justify-center bg-[#1A1B1E] hover:!bg-gray-700/90 text-white font-medium pl-3 pr-2 md:pl-4 md:pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px] text-sm md:text-base"
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  aria-label="Go to wallet"
                >
                  Wallet
                </WalletDropdownLink>
                
                <WalletDropdownLink
                  className="py-2 md:py-3 rounded-xl flex items-center justify-center bg-[#1A1B1E] hover:!bg-gray-700/90 text-white font-medium pl-3 pr-2 md:pl-4 md:pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px] text-sm md:text-base"
                  icon="wallet"
                  href={address ? `https://basescan.org/address/${address}` : '#'}
                  aria-label="View wallet on explorer"
                >
                  View on Explorer
                </WalletDropdownLink>
                
                <div className="pt-1 pb-1 md:pt-2 md:pb-2">
                  <WalletDropdownDisconnect className="w-full bg-[#1A1B1E] hover:!bg-red-900/60 transition-all duration-200 py-2 md:py-3 rounded-xl text-white font-medium border border-gray-700/30 hover:border-red-500/30 hover:translate-y-[-2px] text-sm md:text-base" />
                </div>
              </div>
            </div>
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}