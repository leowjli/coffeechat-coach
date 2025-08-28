import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

// Only initialize if Redis credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // 10 requests per minute per user for generate/email endpoints
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  });
}

export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!ratelimit) {
    // If no rate limiting configured, allow all requests
    return true;
  }

  const { success } = await ratelimit.limit(identifier);
  return success;
}

export { ratelimit };