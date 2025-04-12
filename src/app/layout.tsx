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
        <MetaTags />
      </head>
      <body
        suppressHydrationWarning={true}
        className="antialiased bg-gray-900 text-white flex flex-col min-h-screen max-w-[100vw] overflow-x-hidden"
      >
        <Providers>
          <div className="flex-grow w-full overflow-x-hidden">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
