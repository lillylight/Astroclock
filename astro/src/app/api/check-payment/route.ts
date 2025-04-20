import { NextRequest, NextResponse } from 'next/server';
import { getPayment } from '@/services/payment';

/**
 * API endpoint for checking the status of a payment
 * 
 * This endpoint first checks our local payment records.
 * If the payment is not found or not completed, it falls back to checking
 * the Coinbase Commerce API directly.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body to get the charge ID
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { chargeId } = requestData;
    
    if (!chargeId) {
      return NextResponse.json(
        { error: 'Charge ID is required' },
        { status: 400 }
      );
    }

    console.log(`Checking payment status for charge: ${chargeId}`);
    
    // First, check our local payment records
    const payment = await getPayment(chargeId);
    
    if (payment) {
      console.log(`Found payment record for charge ${chargeId}: ${payment.status}`);
      
      // Map our payment status to the format expected by the frontend
      const isCompleted = payment.status === 'completed' || payment.status === 'confirmed';
      const isPending = payment.status === 'pending';
      const isExpired = payment.status === 'expired';
      const isCanceled = payment.status === 'canceled';
      
      return NextResponse.json({
        chargeId,
        status: payment.status.toUpperCase(),
        isCompleted,
        isPending,
        isExpired,
        isCanceled,
        localRecord: true,
        payment
      });
    }
    
    // If payment not found in our records, fall back to checking the Coinbase Commerce API
    console.log(`No local payment record found for charge ${chargeId}, checking Coinbase API...`);
    
    // Get the Coinbase Commerce API Key from environment variables
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    
    if (!apiKey) {
      console.error('COINBASE_COMMERCE_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check the charge status using the Coinbase Commerce API
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22'
      }
    };
    
    try {
      const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, options);
      const data = await response.json();

      if (!response.ok) {
        console.error('Error checking charge:', data);
        return NextResponse.json(
          { error: data.error?.message || 'Failed to check charge' },
          { status: response.status }
        );
      }

      // Extract the relevant payment status information
      const { timeline, payments } = data.data;
      const status = timeline[timeline.length - 1]?.status || 'NEW';
      const isCompleted = status === 'COMPLETED';
      const isPending = status === 'PENDING';
      const isExpired = status === 'EXPIRED';
      const isCanceled = status === 'CANCELED';
      
      console.log(`Payment status from Coinbase API for charge ${chargeId}: ${status}`);
      
      return NextResponse.json({
        chargeId,
        status,
        isCompleted,
        isPending,
        isExpired,
        isCanceled,
        localRecord: false,
        timeline,
        payments: payments || []
      });
    } catch (fetchError) {
      console.error('Network error when checking charge:', fetchError);
      return NextResponse.json(
        { error: 'Network error when connecting to Coinbase Commerce API' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error checking charge:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
