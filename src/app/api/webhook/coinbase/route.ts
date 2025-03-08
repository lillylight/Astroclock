import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updatePaymentStatus, PaymentStatus } from '@/services/payment';

/**
 * Coinbase Commerce Webhook Handler
 * 
 * This endpoint receives webhook notifications from Coinbase Commerce
 * when payment statuses change. It verifies the webhook signature and
 * processes the event accordingly.
 * 
 * Note: This endpoint requires HTTPS to work with Coinbase Commerce webhooks
 * and will only function when deployed to production with a valid HTTPS URL.
 * 
 * Setup instructions:
 * 1. Deploy your application to a production environment with HTTPS
 * 2. Get your webhook shared secret from Coinbase Commerce Dashboard
 * 3. Add the shared secret to your environment variables as COINBASE_WEBHOOK_SECRET
 * 4. Register your webhook URL (https://your-domain.com/api/webhook/coinbase) in the Coinbase Commerce Dashboard
 */
export async function POST(req: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // Get the signature from the headers
    const signature = req.headers.get('x-cc-webhook-signature');
    
    if (!signature) {
      console.error('No signature found in webhook request');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 401 }
      );
    }
    
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('COINBASE_WEBHOOK_SECRET is not set in environment variables');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    // Verify the signature
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    
    if (computedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Process the webhook event
    const event = body.event;
    
    if (!event) {
      console.error('No event found in webhook payload');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // Extract the charge data
    const { id, code, timeline, payments } = event.data;
    
    // Log the event
    console.log(`Received webhook event: ${event.type} for charge ${id}`);
    
    // Map Coinbase event types to our payment status types
    let status: PaymentStatus | null = null;
    
    // Process based on event type
    switch (event.type) {
      case 'charge:created':
        // A new charge was created
        console.log(`Charge created: ${id}`);
        status = 'created';
        break;
        
      case 'charge:confirmed':
        // Payment confirmed (blockchain confirmation)
        console.log(`Charge confirmed: ${id}`);
        status = 'confirmed';
        break;
        
      case 'charge:failed':
        // Payment failed
        console.log(`Charge failed: ${id}`);
        status = 'failed';
        break;
        
      case 'charge:delayed':
        // Payment delayed
        console.log(`Charge delayed: ${id}`);
        status = 'delayed';
        break;
        
      case 'charge:pending':
        // Payment pending
        console.log(`Charge pending: ${id}`);
        status = 'pending';
        break;
        
      case 'charge:resolved':
        // Charge resolved (completed)
        console.log(`Charge resolved: ${id}`);
        status = 'completed';
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Update payment status if we have a valid status
    if (status) {
      const updatedPayment = await updatePaymentStatus(id, status);
      
      if (!updatedPayment) {
        console.warn(`Payment not found for charge ${id}. Creating a new record.`);
        // In a production environment, you might want to create a new payment record here
        // or handle this case differently
      } else {
        console.log(`Payment status updated to ${status} for charge ${id}`);
      }
    }
    
    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
