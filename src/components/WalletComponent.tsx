import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ConnectButton,
  useWallet,
  WalletDropdown,
  WalletDropdownItem,
  CheckoutWithCard
} from '@coinbase/onchainkit/wallet';
import { Avatar } from '@coinbase/onchainkit/identity';

const WalletComponent: React.FC = () => {
  const { isConnected, walletAddress } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || '2bde99f3-84a0-4b81-9338-430eafdb9c36';

  return (
    <div className="flex justify-end p-4 relative sm:p-2">
      {/* Subtle background glow effect - positioned behind the button */}
      <div className="absolute right-4 top-4 w-full max-w-[240px] h-12 pointer-events-none sm:w-full sm:h-10">
        <div className={`absolute inset-0 rounded-2xl blur-md opacity-20 ${isConnected ? 'bg-gradient-to-r from-green-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}></div>
      </div>

      {/* Main wallet interface */}
      <div className="relative z-10">
        {isConnected ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Avatar address={walletAddress || ''} />
              <span className="text-sm font-medium">Connected</span>
            </motion.button>

            {showDropdown && (
              <WalletDropdown>
                <div className="p-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <CheckoutWithCard
                    productId={PRODUCT_ID}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                  >
                    <span>+ Add Funds</span>
                  </CheckoutWithCard>
                  <WalletDropdownItem
                    onClick={() => setShowDropdown(false)}
                    className="px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                  >
                    Disconnect
                  </WalletDropdownItem>
                </div>
              </WalletDropdown>
            )}
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  );
};

export default WalletComponent;