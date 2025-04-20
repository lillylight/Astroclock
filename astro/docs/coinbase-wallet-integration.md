# Coinbase Wallet Integration Guide

## Overview

This guide explains how the Astro Clock application integrates with Coinbase Wallet and other cryptocurrency wallets using the Wagmi library and OnchainKit. This integration enables users to connect their wallets and make cryptocurrency payments directly from the application.

## Architecture

The wallet integration consists of several key components:

1. **Wagmi Configuration** - Sets up wallet connectors and chain configurations
2. **Provider Structure** - Wraps the application with necessary context providers
3. **Wallet Components** - UI components for wallet connection and interaction
4. **Payment Flow** - Integration with Coinbase Commerce for payments

## Setup and Configuration

### Environment Variables

The application requires these environment variables:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_PRODUCT_ID=your_coinbase_commerce_product_id
```

### Wagmi Configuration

The `src/wagmi.ts` file configures the wallet connection system:

```typescript
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { 
  coinbaseWallet,
  injected,
  walletConnect
} from 'wagmi/connectors';

// Get the WalletConnect project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Create the wagmi config
export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    // Coinbase Wallet - recommended
    coinbaseWallet({
      appName: 'Astro Clock',
    }),
    // Browser extension wallets (MetaMask, etc.)
    injected(),
    // WalletConnect for mobile wallets
    walletConnect({
      projectId,
    }),
  ],
});

// Export the configured coinbaseWallet for use in components
export { coinbaseWallet };
```

### Provider Structure

The `src/providers.tsx` file sets up the provider structure:

```typescript
'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { config } from './wagmi';

// Create a client for React Query
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  // Log the API key being used (without revealing the full key)
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "";
  console.log('Using OnchainKit API Key:', apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5));
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={apiKey}
          chain={base} // Using Base mainnet for production
          config={{
            appearance: {
              name: 'Astro Clock',
              theme: 'dark',
              logo: '/images/logo.png',
            },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Wallet Components

### WalletWrapper Component

The `src/components/WalletWrapper.tsx` component provides a consistent wallet connection interface:

```typescript
'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface WalletWrapperProps {
  className?: string;
  text?: string;
}

export function WalletWrapper({ className, text }: WalletWrapperProps) {
  const { isConnected } = useAccount();
  
  return (
    <div className={`flex justify-end ${className || ''}`}>
      <ConnectButton 
        showBalance={false}
        chainStatus="icon"
        accountStatus="address"
      />
    </div>
  );
}
```

### Wallet Component

The `src/components/Wallet.tsx` component handles wallet-specific functionality:

```typescript
'use client';

import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export function Wallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  if (!isConnected || !address) {
    return null;
  }
  
  return (
    <div className="wallet-info">
      <div className="address">
        {address.substring(0, 6)}...{address.substring(address.length - 4)}
      </div>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
```

## Payment Flow

### PaymentComponent

The `src/components/PaymentComponent.tsx` integrates with Coinbase Commerce for payments:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { Header } from './Header';

interface PaymentComponentProps {
  onPaymentSuccess: () => void;
}

export function PaymentComponent({ onPaymentSuccess }: PaymentComponentProps) {
  const { isConnected } = useAccount();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  
  // Get the product ID from environment variables
  const productId = process.env.NEXT_PUBLIC_PRODUCT_ID || '';

  // Set up an effect to listen for payment status changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'checkout-status-change') {
        console.log('Payment status changed:', event.data.status);
        
        if (event.data.status === 'success') {
          // Call onPaymentSuccess after a short delay
          setTimeout(() => {
            onPaymentSuccess();
          }, 2000);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onPaymentSuccess]);

  // Component implementation...
}
```

## User Flow

1. **Wallet Connection**:
   - User clicks the "Connect Wallet" button
   - Wallet selection modal appears
   - User selects a wallet (Coinbase Wallet, MetaMask, etc.)
   - User approves the connection
   - Application displays the connected wallet address

2. **Payment Process**:
   - User completes the birth details form
   - User is presented with the payment screen
   - User accepts the disclaimer
   - User clicks the "Pay" button
   - Coinbase Commerce checkout opens
   - User completes the payment
   - Application receives payment confirmation
   - User is shown their reading results

## Supported Wallets

The application supports multiple wallet types:

1. **Coinbase Wallet** - Recommended for the best experience
2. **Browser Extension Wallets** - MetaMask, Trust Wallet, etc.
3. **WalletConnect** - For mobile wallet connections

## Network Configuration

The application is configured to use the Base network (Coinbase's L2 solution) for all transactions. This provides:

- Lower transaction fees
- Faster confirmation times
- Better user experience

## Testing

To test the wallet integration:

1. Run the application locally: `npm run dev`
2. Open the application in a browser with wallet extensions installed
3. Click "Connect Wallet" and select a wallet
4. Verify the wallet connects successfully
5. Test the payment flow with a test product

## Troubleshooting

### Common Issues

- **Wallet Not Connecting**: Ensure the wallet extension is installed and unlocked
- **Network Errors**: Verify the wallet is set to the Base network
- **Payment Failures**: Check the browser console for error messages
- **Missing Environment Variables**: Ensure all required environment variables are set

### Browser Compatibility

The wallet integration works best with:
- Chrome with wallet extensions
- Brave Browser (built-in wallet support)
- Firefox with wallet extensions
- Mobile browsers with wallet apps installed

## Additional Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [OnchainKit Documentation](https://docs.onchainkit.xyz/)
- [Coinbase Wallet Developer Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs)
- [Base Network Documentation](https://docs.base.org/)
