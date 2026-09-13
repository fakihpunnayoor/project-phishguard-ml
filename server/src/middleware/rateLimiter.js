import rateLimit from 'express-rate-limit';

export const scanRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Scan query rate limit exceeded. Please wait a few minutes before scanning additional URLs.',
    code: 429
  },
  skip: (req) => {
    // Skip rate limit in development or local loopback
    return process.env.NODE_ENV === 'test';
  }
});
