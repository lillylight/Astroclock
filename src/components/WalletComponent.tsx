'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ConnectButton,
  WalletButton,
  WalletDropdown,
  WalletDropdownItem,
} from '@coinbase/onchainkit';
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

      <ConnectButton />

      {isConnected && (
        <WalletDropdown>
          <WalletDropdownItem
            label="Copy Address"
            onClick={handleCopyAddress}
            icon={copySuccess ? "check" : "copy"}
          />
          <WalletDropdownItem
            label="Add Funds"
            href={`https://commerce.coinbase.com/checkout/${productId}`}
            icon="plus"
          />
          <WalletDropdownItem
            label="Disconnect"
            onClick={() => {
              // Handle disconnect
            }}
            icon="logout" 
          />
        </WalletDropdown>
      )}
    </div>
  );
}