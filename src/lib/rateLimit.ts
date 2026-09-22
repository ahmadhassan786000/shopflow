/**
 * Minimal in-memory sliding-window rate limiter for single-instance deployments.
 * In production behind multiple server instances, swap this for a shared store
 * (e.g. Upstash Redis / @upstash/ratelimit) so limits are enforced globally.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

// Presets for common sensitive endpoints
export const RATE_LIMITS = {
  LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts / 15 min
  REGISTER: { limit: 5, windowMs: 60 * 60 * 1000 },
  FORGOT_PASSWORD: { limit: 3, windowMs: 15 * 60 * 1000 },
  REVIEW_SUBMIT: { limit: 10, windowMs: 60 * 60 * 1000 },
  COUPON_APPLY: { limit: 10, windowMs: 10 * 60 * 1000 },
};
