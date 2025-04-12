
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ConnectButton as ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
  ConnectButtonText as ConnectWalletText,
  CheckoutWithCard as FundButton,
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
  const productId = "2bde99f3-84a0-4b81-9338-430eafdb9c36";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isConnected && mounted) {
      localStorage.setItem('resetOnConnect', 'true');
    }
  }, [isConnected, mounted]);

  useEffect(() => {
    if (isConnected) {
      console.log('Wallet is connected');
    } else {
      localStorage.removeItem('hasRedirected');
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
      <div className="absolute right-4 top-4 w-full max-w-[240px] h-12 pointer-events-none sm:w-full sm:h-10">
        <div className={`absolute inset-0 rounded-2xl blur-md opacity-20 ${isConnected ? 'bg-gradient-to-r from-green-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>
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
              />
              <div className="absolute w-2 h-2 bg-green-500 rounded-full right-0 top-0" />
            </div>
          )}
          <Avatar className="h-6 w-6" />
          <ConnectWalletText>
            {isConnected ? '' : 'Connect Wallet'}
          </ConnectWalletText>
          <Name className="font-medium" />
        </ConnectWallet>

        <WalletDropdown className="!bg-transparent !shadow-none !border-0 !overflow-visible w-full max-w-[240px] right-0 origin-top-right z-50">
          <div className="backdrop-blur-md bg-[#1a1b1e]/95 rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50">
            <div className="p-4 bg-[#1a1b1e]/95 relative">
              <div className="text-gray-400 text-sm mb-1">BALANCE</div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/images/eth-logo.svg" alt="ETH" className="w-6 h-6" />
                <div className="text-2xl font-bold">0.0001 ETH</div>
              </div>
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

            <div className="p-3 relative z-10">
              <FundButton 
                productId={productId}
                className="w-full py-3 rounded-xl flex items-center justify-center bg-[#2B62F6] hover:bg-[#2B62F6]/90 text-white font-medium mb-2 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Funds
              </FundButton>

              <WalletDropdownLink
                className="w-full py-3 rounded-xl flex items-center justify-center bg-[#1a1b1e] hover:bg-[#25262b] text-white font-medium transition-all duration-200 border border-gray-800/30"
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                Wallet
              </WalletDropdownLink>

              <div className="pt-2 pb-2">
                <WalletDropdownDisconnect className="w-full bg-gray-800/80 hover:!bg-red-900/60 transition-all duration-200 py-3 rounded-xl text-white font-medium border border-gray-700/30 hover:border-red-500/30 hover:translate-y-[-2px]" />
              </div>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
