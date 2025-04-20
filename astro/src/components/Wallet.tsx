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
  
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  if (!mounted) return null;

  return (
    <div className="flex justify-end p-4 relative">
      {/* Subtle background glow effect - positioned behind the button */}
      <div className="absolute right-4 top-4 w-40 h-12 pointer-events-none">
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
            w-56 max-w-[90vw] sm:w-48 xs:w-40
            text-base sm:text-sm xs:text-xs
            scale-100 sm:scale-95 xs:scale-90
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
        
        <WalletDropdown className="!bg-transparent !shadow-none !border-0 !overflow-visible w-[200px] max-w-[90vw] right-0 origin-top-right z-50 rounded-2xl p-2 bg-[#181B23]">
          <div className="backdrop-blur-md bg-gray-900/90 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50" style={{ borderRadius: '1.5rem' }}>
            {/* Subtle background patterns - reduced intensity */}
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-500 rounded-full blur-xl"></div>
            </div>
            
            <div className="px-4 pt-4 pb-3 bg-gray-800/90 relative">
              <div className="flex items-center mb-1">
                <motion.div 
                  className={`text-lg font-bold text-white cursor-pointer flex items-center ${copySuccess ? 'text-green-400' : 'text-white'}`}
                  onClick={handleCopyAddress}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {address 
                    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                    : '0x...'
                  }
                  
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1.5 ${copySuccess ? 'text-green-400' : 'text-gray-400'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    animate={copySuccess ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
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
                </motion.div>
              </div>
              <div className="text-green-400 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-.56 1.25-1.25 1.25v-2.5z" />
                </svg>
                0.0001 ETH
              </div>
            </div>
            
            <div className="py-2 px-2 relative z-10">
              <WalletDropdownLink
                className="py-3 rounded-2xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-4 pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px]"
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownLink
                className="py-3 rounded-2xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-4 pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px]"
                icon="wallet"
                href={address ? `https://basescan.org/address/${address}` : '#'}
              >
                View on Explorer
              </WalletDropdownLink>
              <WalletDropdownLink
                className="py-3 rounded-2xl flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200 my-1 pl-4 pr-2"
                icon="wallet"
                href="#"
              >
                Add Funds
              </WalletDropdownLink>
              <div className="pt-2 pb-2">
                <WalletDropdownDisconnect className="w-full bg-gray-800/80 hover:!bg-red-900/60 transition-all duration-200 py-3 rounded-2xl text-white font-medium border border-gray-700/30 hover:border-red-500/30 hover:translate-y-[-2px]" />
              </div>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
