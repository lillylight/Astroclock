import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rate-limiter';
import { createPayment } from '@/services/payment';

/**
 * API endpoint for creating dynamic charges using the Coinbase Commerce API
 * This follows the recommended approach from the Coinbase documentation
 */
export async function POST(req: NextRequest) {
  console.log('Creating new Coinbase Commerce charge...');
  
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown-ip';
    
    // Check rate limit (3 requests per minute)
    const rateLimit = checkRateLimit(ip.toString(), 3, 60 * 1000);
    
    // If rate limited, return 429 Too Many Requests
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: new Date(rateLimit.resetTime).toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }
    
    // Get the Coinbase Commerce API Key from environment variables
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    
    if (!apiKey) {
      console.error('COINBASE_COMMERCE_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request body if it exists
    let requestData = {};
    try {
      const body = await req.json();
      if (body && typeof body === 'object') {
        requestData = body;
      }
    } catch (e) {
      // If no body or invalid JSON, use default values
    }

    // Default values
    const amount = (requestData as any).amount || '1.00';
    const currency = (requestData as any).currency || 'USDC';
    const customerId = (requestData as any).customerId || 'anonymous';

    // Create a charge using the Coinbase Commerce API
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: 'Birth Time Prediction',
        description: 'Personalized birth time prediction based on your details',
        pricing_type: 'fixed_price',
        local_price: { 
          amount: amount, 
          currency: currency 
        },
        metadata: { 
          customer_id: customerId,
          product_type: 'birth_time_prediction',
          timestamp: new Date().toISOString()
        }
      }),
    };

    console.log('Sending request to Coinbase Commerce API...');
    
    try {
      const response = await fetch('https://api.commerce.coinbase.com/charges', options);
      const data = await response.json();

      if (!response.ok) {
        console.error('Error creating charge:', data);
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        
        return NextResponse.json(
          { error: data.error?.message || 'Failed to create charge' },
          { status: response.status }
        );
      }

      console.log('Charge created successfully:', data.data.code);
      
      // Create a payment record in our system
      try {
        const { id, code } = data.data;
        const { amount, currency } = data.data.pricing.local;
        const customerId = (requestData as any).customerId || 'anonymous';
        
        // Store metadata for reference
        const metadata = {
          hosted_url: data.data.hosted_url,
          created_at: data.data.created_at,
          product_type: 'birth_time_prediction'
        };
        
        // Create the payment record
        await createPayment(id, code, amount, currency, customerId, metadata);
        console.log(`Payment record created for charge ${id}`);
      } catch (paymentError) {
        console.error('Error creating payment record:', paymentError);
        // Halt the process and alert the user
        return NextResponse.json(
          { error: 'Payment verification failed. Please retry your payment.' },
          { status: 500 }
        );
      }
      
      // Return the charge ID and other relevant data
      return NextResponse.json({
        id: data.data.id,
        code: data.data.code,
        hosted_url: data.data.hosted_url,
        created_at: data.data.created_at,
        pricing: {
          local: data.data.pricing.local,
          blockchain: data.data.pricing.blockchain
        }
      });
    } catch (fetchError) {
      console.error('Network error when creating charge:', fetchError);
      return NextResponse.json(
        { error: 'Network error when connecting to Coinbase Commerce API' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating charge:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
