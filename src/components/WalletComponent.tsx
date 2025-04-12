'use client';

import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { 
  FundButton, 
  Wallet, 
  ConnectButton, 
  WalletDropdown, 
  WalletDropdownLink, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit';

export function WalletComponent() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-end max-w-full overflow-visible z-50">
      <Wallet>
        <ConnectButton 
          buttonClassName="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full text-white font-medium transition-colors" 
          modalSize="compact"
          modalTitle="Connect your wallet"
        />
        <WalletDropdown
          align="right"
          dropdownContainerClassName="mt-2 w-64 p-3 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/30"
          buttonContainerClassName="p-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
          buttonClassName="py-1.5 px-4 rounded-full bg-gradient-to-r from-indigo-500/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-600 text-white flex items-center gap-2"
          menuButtonText={
            <span className="flex items-center gap-2 truncate max-w-[150px]">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDNS41OTI4NiAyIDIgNS41OTI4NiAyIDEwQzIgMTQuNDA3MSA1LjU5Mjg2IDE4IDEwIDE4QzE0LjQwNzEgMTggMTggMTQuNDA3MSAxOCAxMEMxOCA1LjU5Mjg2IDE0LjQwNzEgMiAxMCAyWk05LjAwMDA1IDcuMjg1NzVDOS4zNDEwOCA3LjI4NTc1IDkuNjE4MzYgNy41NjMwMyA5LjYxODM2IDcuOTA0MDZWMTIuMDk2MkM5LjYxODM2IDEyLjQzNzIgOS4zNDEwOCAxMi43MTQ1IDkuMDAwMDUgMTIuNzE0NUg3Ljc2MTczQzcuNDIwNyAxMi43MTQ1IDcuMTQzNDMgMTIuNDM3MiA3LjE0MzQzIDEyLjA5NjJWNy45MDQwNkM3LjE0MzQzIDcuNTYzMDMgNy40MjA3IDcuMjg1NzUgNy43NjE3MyA3LjI8NTc1SDkuMDAwMDVaTTEyLjIzODMgNy4yODU3NUMxMi41NzkzIDcuMjg1NzUgMTIuODU2NiA3LjU2MzAzIDEyLjg1NjYgNy45MDQwNlYxMi4wOTYyQzEyLjg1NjYgMTIuNDM3MiAxMi41NzkzIDEyLjcxNDUgMTIuMjM4MyAxMi43MTQ1SDEwLjk5OTlDMTAuNjU4OSAxMi43MTQ1IDEwLjM4MTYgMTIuNDM3MiAxMC4zODE2IDEyLjA5NjJWNy45MDQwNkMxMC4zODE2IDcuNTYzMDMgMTAuNjU4OSA3LjI4NTc1IDEwLjk5OTkgNy4yODU3NUgxMi4yMzgzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" 
                 className="h-5 w-5 flex-shrink-0" 
                 alt="wallet icon" />
              <span className="truncate">
                {address ? `${address.slice(0, 5)}...${address.slice(-4)}` : 'Connect'}
              </span>
            </span>
          }
        >
          <div className="flex flex-col">
            <div className="mb-3 p-3 bg-gray-900/40 rounded-xl">
              <div className="uppercase text-xs font-medium text-gray-400 mb-1">BALANCE</div>

              <div className="flex items-center gap-2 mb-2">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUdwTP///3KUymSHtP///4+x2v///9zk8f///42n1P///1Zxpmajzv///7vJ34mt1v///1N0qXCQxn4l1+UAAAAKdFJOUwD/6P//D/+PAADG8xF2AAAAa0lEQVQY043OOxKAIAwE0K0ioCn0/qd1AZkUlO+0eZPdCADRcZ4kiWfniMeW1Voiaulq6dYmL7dSZl605sdGT2HQE23nQNoxg4XiwZ71IFdTfzlEYJJ1xJfbBDdg/xfsDXCnNLwYcG/VfwHjRgMo88aZvgAAAABJRU5ErkJggg==" 
                     alt="ETH" 
                     className="w-6 h-6 flex-shrink-0" 
                />
                <div className="text-lg font-bold">
                  {balanceData?.formatted ? Number(balanceData.formatted).toFixed(4) : '0.0000'} ETH
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDNS41OTI4NiAyIDIgNS41OTI4NiAyIDEwQzIgMTQuNDA3MSA1LjU5Mjg2IDE4IDEwIDE4QzE0LjQwNzEgMTggMTggMTQuNDA3MSAxOCAxMEMxOCA1LjU5Mjg2IDE0LjQwNzEgMiAxMCAyWk05LjAwMDA1IDcuMjg1NzVDOS4zNDEwOCA3LjI4NTc1IDkuNjE4MzYgNy41NjMwMyA5LjYxODM2IDcuOTA0MDZWMTIuMDk2MkM5LjYxODM2IDEyLjQzNzIgOS4zNDEwOCAxMi43MTQ1IDkuMDAwMDUgMTIuNzE0NUg3Ljc2MTczQzcuNDIwNyAxMi43MTQ1IDcuMTQzNDMgMTIuNDM3MiA3LjE0MzQzIDEyLjA5NjJWNy45MDQwNkM3LjE0MzQzIDcuNTYzMDMgNy40MjA3IDcuMjg1NzUgNy43NjE3MyA3LjI4NTc1SDkuMDAwMDVaTTEyLjIzODMgNy4yODU3NUMxMi41NzkzIDcuMjg1NzUgMTIuODU2NiA3LjU2MzAzIDEyLjg1NjYgNy45MDQwNlYxMi4wOTYyQzEyLjg1NjYgMTIuNDM3MiAxMi41NzkzIDEyLjcxNDUgMTIuMjM4MyAxMi43MTQ1SDEwLjk5OTlDMTAuNjU4OSAxMi43MTQ1IDEwLjM4MTYgMTIuNDM3MiAxMC4zODE2IDEyLjA5NjJWNy45MDQwNkMxMC4zODE2IDcuNTYzMDMgMTAuNjU4OSA3LjI4NTc1IDEwLjk5OTkgNy4yODU3NUgxMi4yMzgzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" 
                       alt="Wallet" 
                       className="w-5 h-5 flex-shrink-0" />
                  <span>Wallet</span>
                </div>

                <FundButton 
                  onError={(error) => console.error("Fund error:", error)}
                  productId={process.env.NEXT_PUBLIC_PRODUCT_ID || ''}
                  className="flex items-center w-full p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-5 h-5 mr-2 flex-shrink-0 text-lg font-bold">+</div>
                    <span>Fund</span>
                  </div>
                </FundButton>
              </div>
            </div>

            <div className="space-y-1">
              <WalletDropdownLink 
                className="py-2 md:py-3 rounded-xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-4 pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px]"
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                <span className="truncate">Wallet</span>
              </WalletDropdownLink>

              <WalletDropdownLink
                className="py-2 md:py-3 rounded-xl flex items-center bg-gray-800/80 hover:!bg-gray-700/90 text-white font-medium pl-4 pr-2 my-1 transition-all duration-200 border border-gray-700/30 hover:translate-y-[-2px]"
                icon="wallet"
                href={address ? `https://basescan.org/address/${address}` : '#'}
              >
                <span className="truncate">View on Explorer</span>
              </WalletDropdownLink>

              <div className="pt-2 pb-2">
                <WalletDropdownDisconnect className="w-full bg-gray-800/80 hover:!bg-red-900/60 transition-all duration-200 py-2 md:py-3 rounded-xl text-white font-medium border border-gray-700/30 hover:border-red-500/30 hover:translate-y-[-2px]" />
              </div>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}