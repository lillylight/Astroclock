/**
 * Simple in-memory rate limiter for the Coinbase Commerce API
 * Limits requests to 3 per minute per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  // Use Array.from to convert the entries to an array that can be iterated
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier for the requester (e.g., IP address)
 * @param limit - Maximum number of requests allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns Object containing whether the request is allowed and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 3,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);
  if (!entry || entry.resetTime < now) {
    // Create new entry if none exists or the previous one has expired
    entry = { count: 0, resetTime: now + windowMs };
    rateLimitStore.set(identifier, entry);
  }
  
  // Check if the request is allowed
  const allowed = entry.count < limit;
  
  // Increment the counter if allowed
  if (allowed) {
    entry.count++;
  }
  
  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime
  };
}
