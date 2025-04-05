'use client';

import React from 'react';
import { Header } from '../../components/Header';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header isHomePage={false} className="fixed top-0 left-0 w-full z-10" />
      <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
        <div className="bg-secondary p-8 rounded-2xl shadow-2xl border border-gray-700 mt-8 text-left">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: March 7, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Astro Clock ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p>
              Astro Clock provides birth time prediction services using artificial intelligence and Vedic astrology principles. 
              The Service analyzes user-provided information about birth details and physical characteristics to estimate a likely birth time.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Disclaimer</h2>
            <p>
              <strong>For Entertainment Purposes Only:</strong> The Service is provided for entertainment and informational purposes only. 
              While we strive for accuracy, we make no guarantees about the precision of birth time predictions. 
              Do not use our predictions for legal, medical, or other critical purposes that require verified birth times.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. User Accounts and Wallet Connection</h2>
            <p>
              To use certain features of the Service, you must connect a cryptocurrency wallet. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Maintaining the security of your wallet and private keys</li>
              <li>All activities that occur through your connected wallet</li>
              <li>Ensuring you have the right to use the wallet you connect</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Payment Terms</h2>
            <p>
              The Service requires payment for birth time predictions. By making a payment:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>You agree to pay the specified amount in the designated cryptocurrency</li>
              <li>You acknowledge that cryptocurrency transactions are generally irreversible</li>
              <li>You understand that price volatility may affect the fiat currency equivalent of your payment</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. User Content</h2>
            <p>
              When you provide information or upload photos to the Service:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>You retain ownership of your content</li>
              <li>You grant us a license to use, store, and process your content to provide the Service</li>
              <li>You confirm you have the right to share this content</li>
              <li>You agree not to upload illegal, offensive, or harmful content</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, 
              and software, are the exclusive property of Astro Clock or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Astro Clock shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with the Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Astro Clock and its officers, directors, employees, and agents from any claims, 
              damages, losses, liabilities, and expenses (including legal fees) arising out of or related to your use of the Service or violation of these Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Modifications to the Service and Terms</h2>
            <p>
              We reserve the right to modify or discontinue the Service at any time without notice. 
              We may also update these Terms from time to time. Continued use of the Service after any changes constitutes acceptance of the modified Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:magusdalochi@yahoo.com" className="text-indigo-400 hover:text-indigo-300">magusdalochi@yahoo.com</a>
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">13. Additional Disclaimers</h2>
            <p>
              By using this software, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>The predicted time may sometimes be inaccurate or incorrect due to the app's learning process and ongoing improvements.</li>
              <li>Using this software is done at your own risk. The creator is not liable for any loss of funds, damages, or other consequences arising from the use of the Service.</li>
              <li>Your privacy is important to us. We strive to protect user data and ensure confidentiality, but we cannot guarantee absolute security.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
