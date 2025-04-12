import '@coinbase/onchainkit/styles.css';
import React from 'react';
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from '../providers';
import MetaTags from './meta-tags';
import { Footer } from '../components/Footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Removed static metadata in favor of the dynamic MetaTags component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <MetaTags />
      </head>
      <body
        suppressHydrationWarning={true}
        className="antialiased bg-gray-900 text-white flex flex-col min-h-screen overflow-x-hidden"
      >
        <Providers>
          <div className="flex-grow w-full max-w-full overflow-x-hidden">
            <div className="mx-auto max-w-2xl px-3 xs:px-4 sm:px-6">
              {children}
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
