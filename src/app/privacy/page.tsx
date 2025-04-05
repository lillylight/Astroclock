'use client';

import React from 'react';
import { Header } from '../../components/Header';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header isHomePage={false} className="fixed top-0 left-0 w-full z-10" />
      <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
        <div className="bg-secondary p-8 rounded-2xl shadow-2xl border border-gray-700 mt-8 text-left">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: March 7, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>
              Welcome to Astro Clock ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Birth details (location, date, approximate time of day)</li>
              <li>Physical appearance information (if provided manually)</li>
              <li>Photos (if uploaded for analysis)</li>
              <li>Wallet address (when connecting your cryptocurrency wallet)</li>
              <li>Payment information (processed by our payment provider)</li>
              <li>Device information and usage data</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>To provide our birth time prediction service</li>
              <li>To process payments</li>
              <li>To improve our algorithms and services</li>
              <li>To communicate with you about our services</li>
              <li>To ensure the security of our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Service providers who help us operate our platform</li>
              <li>Payment processors to complete transactions</li>
              <li>Legal authorities when required by law</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              You can set your browser to refuse all or some browser cookies, but this may affect certain features of our site.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. 
              We do not knowingly collect personal information from children under 18. 
              If you believe we have collected information from a child under 18, please contact us.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. 
              We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at:
              <br />
              <a href="mailto:magusdalochi@yahoo.com" className="text-indigo-400 hover:text-indigo-300">magusdalochi@yahoo.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
