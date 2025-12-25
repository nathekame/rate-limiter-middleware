import { RequestHandler } from 'express';
import Redis from 'ioredis';


const WINDOW_SECONDS = process.env.WINDOW_SECONDS || 60;
const MAX_REQUESTS = Number(process.env.MAX_REQUESTS) || 3;

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const rateCheck: RequestHandler = async (req, res, next) => {
  try {

    const key = `rate_limit:${req.ip}`;

    const current = await redis.get(key);
    
    if (!current) {
      await redis.setex(key, WINDOW_SECONDS, '1');
      return next();
    }

    const requestCount = parseInt(current, 10);

    if (requestCount >= MAX_REQUESTS) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.',
        retryAfter: `${WINDOW_SECONDS} Seconds` 
      });
    }

    await redis.incr(key);
    
    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    // Fail open - allow request if Redis is down
    // next();
  }
};

export default rateCheck;