const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');
const logger = require('../utils/logger');

// Create Redis client
let redisClient;
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => {
    logger.error('Redis client error:', err);
  });
  
  redisClient.on('connect', () => {
    logger.info('Connected to Redis for rate limiting');
  });
  
  redisClient.connect();
} catch (error) {
  logger.warn('Redis not available, using memory rate limiter');
  redisClient = null;
}

// Rate limiter configurations
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl_general',
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Number of requests
    duration: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60, // Per 15 minutes by default
    blockDuration: 60, // Block for 60 seconds if exceeded
  }),
  
  // Authentication rate limiter (more restrictive)
  auth: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl_auth',
    points: 5, // 5 attempts
    duration: 15 * 60, // Per 15 minutes
    blockDuration: 15 * 60, // Block for 15 minutes
  }),
  
  // AI API rate limiter (very restrictive due to cost)
  ai: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl_ai',
    points: 50, // 50 AI requests
    duration: 60 * 60, // Per hour
    blockDuration: 10 * 60, // Block for 10 minutes
  }),
  
  // File upload rate limiter
  upload: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl_upload',
    points: 10, // 10 uploads
    duration: 60 * 60, // Per hour
    blockDuration: 5 * 60, // Block for 5 minutes
  })
};

// Create rate limiter middleware
const createRateLimiterMiddleware = (limiterName = 'general') => {
  return async (req, res, next) => {
    try {
      const limiter = rateLimiters[limiterName];
      if (!limiter) {
        logger.warn(`Rate limiter '${limiterName}' not found, skipping rate limiting`);
        return next();
      }
      
      const key = req.ip || req.connection.remoteAddress;
      
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const totalHits = rejRes.totalHits;
      const remainingPoints = rejRes.remainingPoints;
      const msBeforeNext = rejRes.msBeforeNext;
      
      logger.warn(`Rate limit exceeded for ${req.ip}:`, {
        limiter: limiterName,
        totalHits,
        remainingPoints,
        msBeforeNext
      });
      
      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 1,
        'X-RateLimit-Limit': rateLimiters[limiterName].points,
        'X-RateLimit-Remaining': remainingPoints || 0,
        'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext)
      });
      
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.round(msBeforeNext / 1000) || 1
      });
    }
  };
};

// Middleware functions for different endpoints
const generalRateLimit = createRateLimiterMiddleware('general');
const authRateLimit = createRateLimiterMiddleware('auth');
const aiRateLimit = createRateLimiterMiddleware('ai');
const uploadRateLimit = createRateLimiterMiddleware('upload');

module.exports = {
  generalRateLimit,
  authRateLimit,
  aiRateLimit,
  uploadRateLimit,
  default: generalRateLimit
};