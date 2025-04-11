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
      
      <div ref={buttonRef}>
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
              max-w-[180px] 
              md:max-w-[220px] 
              right-2 
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
              
              <div className="px-3 pt-3 pb-2 md:px-4 md:pt-4 md:pb-3 bg-gray-800/90 relative">
                <div className="flex items-center mb-1">
                  <motion.button 
                    className={`text-sm md:text-lg font-bold text-white cursor-pointer flex items-center ${copySuccess ? 'text-green-400' : 'text-white'}`}
                    onClick={handleCopyAddress}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Copy wallet address"
                  >
                    {address 
                      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
                      : '0x...'
                    }
                    
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-3 w-3 md:h-4 md:w-4 ml-1.5 ${copySuccess ? 'text-green-400' : 'text-gray-400'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      animate={copySuccess ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                    >
                      {copySuccess ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <>
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </>
                      )}
                    </motion.svg>
                  </motion.button>
                </div>
                <div className="text-green-400 text-xs md:text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  0.0001 ETH
                </div>
              </div>
              
              <div className="py-1 px-1 md:py-2 md:px-2 relative z-10">
                <WalletDropdownLink
                  className="py-2 md:py-3 rounded-xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-3 pr-2 md:pl-4 md:pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px] text-sm md:text-base"
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  aria-label="Go to wallet"
                >
                  Wallet
                </WalletDropdownLink>
                
                <WalletDropdownLink
                  className="py-2 md:py-3 rounded-xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-3 pr-2 md:pl-4 md:pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px] text-sm md:text-base"
                  icon="wallet"
                  href={address ? `https://basescan.org/address/${address}` : '#'}
                  aria-label="View wallet on explorer"
                >
                  View on Explorer
                </WalletDropdownLink>
                
                <div className="pt-1 pb-1 md:pt-2 md:pb-2">
                  <WalletDropdownDisconnect className="w-full bg-gray-800/80 hover:!bg-red-900/60 transition-all duration-200 py-2 md:py-3 rounded-xl text-white font-medium border border-gray-700/30 hover:border-red-500/30 hover:translate-y-[-2px] text-sm md:text-base" />
                </div>
              </div>
            </div>
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}