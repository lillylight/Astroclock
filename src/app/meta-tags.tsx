import React from 'react';

/**
 * Meta tags component for SEO and social sharing
 * Add this component to your layout.tsx file
 */
export default function MetaTags() {
  // Base URL for the application (change this to your production URL when deployed)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://astroclock.app';
  
  // Application metadata
  const title = 'Astro Clock | Discover Your Exact Birth Time';
  const description = 'Astro Clock uses AI and Vedic astrology to determine your exact birth time based on physical traits and astrological patterns. Get precise birth time predictions for accurate birth charts.';
  const keywords = 'birth time, astrology, vedic astrology, birth chart, horoscope, birth time prediction, AI astrology';
  
  // Social media sharing images
  const ogImage = `${baseUrl}/images/og-image.jpg`;
  const twitterImage = `${baseUrl}/images/twitter-image.jpg`;
  
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={baseUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={baseUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={twitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#111827" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Structured Data for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'Astro Clock',
            'description': description,
            'applicationCategory': 'LifestyleApplication',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '1.00',
              'priceCurrency': 'USD'
            },
            'screenshot': ogImage,
            'featureList': 'Birth time prediction, Astrological analysis, Physical trait correlation',
            'author': {
              '@type': 'Organization',
              'name': 'Astro Clock'
            }
          })
        }}
      />
    </>
  );
}

/**
 * Usage instructions:
 * 
 * 1. Add this component to your layout.tsx file:
 * 
 * import MetaTags from './meta-tags';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <head>
 *         <MetaTags />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * 
 * 2. Create the necessary image files:
 * - /public/images/og-image.jpg (1200×630px recommended for Facebook/LinkedIn)
 * - /public/images/twitter-image.jpg (1200×600px recommended for Twitter)
 * - /public/favicon.ico
 * - /public/apple-touch-icon.png (180×180px)
 * - /public/favicon-32x32.png (32×32px)
 * - /public/favicon-16x16.png (16×16px)
 * 
 * 3. Set the NEXT_PUBLIC_BASE_URL environment variable in production
 */
