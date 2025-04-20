# Coinbase Commerce Webhook Integration Guide

## Overview

This guide explains how to set up and use Coinbase Commerce webhooks with the Astro Clock application. Webhooks provide real-time notifications when payment statuses change, making them essential for a reliable payment system in production environments.

## How Webhooks Work

When a customer makes a payment through Coinbase Commerce, the payment goes through several states (created, pending, confirmed, etc.). Coinbase Commerce sends webhook notifications to your server at each state change, allowing your application to react accordingly.

## Setup Process

### 1. Deploy Your Application

Before setting up webhooks, deploy your application to a production environment with HTTPS support. Coinbase Commerce only sends webhooks to secure HTTPS endpoints.

### 2. Configure Coinbase Commerce

1. Log in to your [Coinbase Commerce Dashboard](https://commerce.coinbase.com/dashboard)
2. Navigate to **Settings** > **Webhooks**
3. Click **Add an endpoint**
4. Enter your webhook URL: `https://your-domain.com/api/webhook/coinbase`
5. Copy the generated **Shared Secret**

### 3. Set Environment Variables

Add the Shared Secret to your production environment variables:

```
COINBASE_WEBHOOK_SECRET=your_shared_secret_here
```

This secret is used to verify that webhook requests are authentic and come from Coinbase Commerce.

## Implementation Details

The Astro Clock application implements webhook handling in `src/app/api/webhook/coinbase/route.ts`. This endpoint:

1. Receives webhook notifications from Coinbase Commerce
2. Verifies the webhook signature using the shared secret
3. Updates the payment status in the database
4. Triggers appropriate actions based on the payment status

### Webhook Events

The application handles these webhook events:

| Event Type | Description | Action |
|------------|-------------|--------|
| `charge:created` | A new charge was created | Records the charge in the database |
| `charge:pending` | Payment initiated but not confirmed | Updates payment status to pending |
| `charge:confirmed` | Payment confirmed on blockchain | Updates payment status to confirmed |
| `charge:failed` | Payment failed | Updates payment status to failed |
| `charge:delayed` | Payment delayed | Updates payment status to delayed |
| `charge:resolved` | Charge completed | Updates payment status to completed |

## Testing Webhooks

To test your webhook implementation:

1. In the Coinbase Commerce Dashboard, go to **Settings** > **Webhooks**
2. Find your webhook endpoint and click **Send test webhook**
3. Select an event type (e.g., `charge:confirmed`)
4. Click **Send**
5. Check your application logs to verify the webhook was processed correctly

## Troubleshooting

### Common Issues

- **Invalid Signature Errors**: Ensure the `COINBASE_WEBHOOK_SECRET` environment variable matches the shared secret from Coinbase Commerce.
- **Webhook Not Receiving Events**: Verify your server is accessible from the internet and properly configured for HTTPS.
- **Payment Status Not Updating**: Check your application logs for errors in the webhook processing logic.

### Webhook Logs

Coinbase Commerce provides logs of all webhook deliveries in the dashboard. Use these logs to troubleshoot delivery issues:

1. Go to **Settings** > **Webhooks**
2. Click on your webhook endpoint
3. View the delivery history and status codes

## Security Considerations

- Always verify webhook signatures to prevent fraudulent requests
- Store the shared secret securely as an environment variable
- Implement rate limiting on your webhook endpoint
- Use HTTPS for all webhook communications

## Development vs. Production

During development, the application uses polling to check payment status. In production, it uses webhooks for real-time updates. This dual approach ensures:

- Easy local development without exposing localhost
- Reliable, real-time payment processing in production
- Graceful fallback if webhooks fail

## Additional Resources

- [Coinbase Commerce API Documentation](https://docs.cloud.coinbase.com/commerce/docs/api-reference)
- [Webhook Security Best Practices](https://docs.cloud.coinbase.com/commerce/docs/webhooks#security)
- [HTTP Signature Verification](https://docs.cloud.coinbase.com/commerce/docs/webhooks#http-signature-verification)
