'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="flex justify-end p-4 relative sm:p-2">
      {/* Subtle background glow effect - positioned behind the button */}
      <div className="absolute right-4 top-4 w-40 h-12 pointer-events-none sm:w-32 sm:h-10">
        <div className={`absolute inset-0 rounded-full blur-md opacity-20 ${isConnected ? 'bg-gradient-to-r from-green-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>
      </div>
      
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
            py-2.5
            px-5
            shadow-lg
            relative
            z-10
            sm:py-2 sm:px-4
          `}
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
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="white"/>
                <path d="M3 10L12 3L21 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
          {isConnected && (
            <div className="mr-2 relative">
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute w-2 h-2 bg-green-400 rounded-full right-0 top-0 opacity-70"
              ></motion.div>
              <div className="absolute w-2 h-2 bg-green-500 rounded-full right-0 top-0"></div>
            </div>
          )}
          <Avatar className="h-6 w-6" />
          <ConnectWalletText>
            {isConnected ? '' : 'Connect Wallet'}
          </ConnectWalletText>
          <Name className="font-medium" />
        </ConnectWallet>
        
        <WalletDropdown className="!bg-transparent !shadow-none !border-0 !overflow-visible w-full max-w-[500px] sm:max-w-[300px] right-0 origin-top-right z-50">
          {/* New dropdown menu design */}
          <div className="bg-[#1e2126] rounded-[20px] shadow-2xl overflow-hidden border border-gray-700/20">
            {/* Account bar with gradient background */}
            <div className="bg-gradient-to-r from-[#2ecc71] to-[#26a69a] p-3 flex items-center">
              <div className="w-7 h-7 bg-[#121418] rounded-full flex items-center justify-center mr-3">
                <div className="w-3.5 h-3.5 bg-[#26a69a] rounded-full"></div>
              </div>
              <div 
                className="text-[#121418] text-lg font-semibold cursor-pointer"
                onClick={handleCopyAddress}
              >
                {address 
                  ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                  : '0x...'
                }
              </div>
            </div>
            
            {/* Balance section */}
            <div className="p-5">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">BALANCE</div>
              <div className="flex items-center text-3xl font-bold text-white mb-6">
                <svg className="w-8 h-8 mr-3 text-gray-400" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.994-15.781L16.498 4 9 16.22l7.498 4.353 7.496-4.354zM16.498 27.11L9 19.566l7.498 5.43 7.496-5.43-7.496 7.544z"/>
                </svg>
                0.0001 ETH
              </div>
              
              {/* Menu items */}
              <WalletDropdownLink
                className="flex items-center bg-[#262a30] hover:bg-[#2d3238] rounded-2xl p-4 mb-3 transition-all duration-200"
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                <div className="text-white text-lg font-medium">Wallet</div>
              </WalletDropdownLink>
              
              {/* Add Funds button styled as primary button */}
              <div className="bg-[#4a6fee] hover:bg-[#3f64e0] rounded-2xl p-4 mb-3 transition-all duration-200 cursor-pointer text-center">
                <div className="text-white text-lg font-medium">Add Funds</div>
              </div>
              
              {/* Disconnect button */}
              <WalletDropdownDisconnect className="flex items-center bg-[#262a30] hover:bg-[#2d3238] rounded-2xl p-4 transition-all duration-200 w-full">
                <div className="mr-4 text-gray-400">
                  <svg className="w-6 h-6 transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-white text-lg font-medium">Disconnect</div>
              </WalletDropdownDisconnect>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}