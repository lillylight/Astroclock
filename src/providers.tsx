'use client';

import * as React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
          chain={base}
        >
          {mounted && children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}