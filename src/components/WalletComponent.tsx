
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
import { FundButton } from '@coinbase/onchainkit/fund';
import {
  Avatar,
  Name,
} from '@coinbase/onchainkit/identity';
import { useAccount, useBalance } from 'wagmi';

export function WalletComponent() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Fetch wallet balance
  const { data: balanceData } = useBalance({
    address: address,
    watch: true,
  });
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (isConnected) {
      console.log('Wallet is connected');
    }
  }, [isConnected]);

  // We're removing the copy address functionality since it's not in the new design
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
        
        <WalletDropdown className="!bg-transparent !shadow-none !border-0 !overflow-visible w-full max-w-[220px] sm:max-w-[180px] right-0 origin-top-right z-50">
          <div className="bg-[#111218] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="p-4 pb-2">
              <div className="uppercase text-gray-400 text-xs font-semibold mb-1">BALANCE</div>
              <div className="flex items-center text-white text-lg font-bold mb-4">
                <svg className="h-5 w-5 mr-2 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9999 2L4.80005 12.6L12 16.2L19.2 12.6L11.9999 2Z" fill="currentColor"/>
                  <path d="M12 16.2L4.8 12.6L12 22L19.2 12.6L12 16.2Z" fill="currentColor" fillOpacity="0.7"/>
                </svg>
                {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.0000 ETH'}
              </div>
              
              <div className="space-y-2">
                <WalletDropdownLink
                  className="py-3 rounded-xl flex items-center bg-[#1a1b25] text-white font-medium pl-4 pr-2 transition-all duration-200"
                  icon="wallet"
                  href="https://keys.coinbase.com"
                >
                  Wallet
                </WalletDropdownLink>
                
                <FundButton 
                  className="w-full py-3 rounded-xl flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200"
                  text="Add Funds"
                  productId={process.env.NEXT_PUBLIC_PRODUCT_ID || "2bde99f3-84a0-4b81-9338-430eafdb9c36"}
                >
                  <div className="flex items-center pl-4">
                    <svg className="h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Funds
                  </div>
                </FundButton>
                
                <WalletDropdownDisconnect className="w-full bg-[#1a1b25] transition-all duration-200 py-3 rounded-xl text-white font-medium flex items-center pl-4">
                  <svg className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Disconnect
                </WalletDropdownDisconnect>
              </div>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
