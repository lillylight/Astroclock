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
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set in the environment variables.');
  }
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
