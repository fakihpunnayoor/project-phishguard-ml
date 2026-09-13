import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class FallbackMemoryCache {
  constructor() {
    this.store = new Map();
    console.log('⚡ [Redis Fallback] Running resilient In-Memory Cache (Redis service unreachable or optional)');
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, mode, duration) {
    let expiresAt = null;
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }

  async keys(pattern) {
    const now = Date.now();
    const activeKeys = [];
    for (const [k, v] of this.store.entries()) {
      if (v.expiresAt && now > v.expiresAt) {
        this.store.delete(k);
      } else {
        activeKeys.push(k);
      }
    }
    return activeKeys;
  }

  get status() {
    return 'in-memory-fallback';
  }
}

let redisClient;
let isUsingFallback = false;

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 0,
    retryStrategy: () => null, // Do not hang or retry endlessly if daemon not active
    enableOfflineQueue: false,
    connectTimeout: 600,
    lazyConnect: true
  });

  redisClient.on('connect', () => {
    console.log('🟢 [Redis] Connected successfully to Redis server');
    isUsingFallback = false;
  });

  redisClient.on('error', (err) => {
    if (!isUsingFallback) {
      console.warn(`⚠️ [Redis Warning] Connection failed (${err.message}). Switched to resilient memory cache.`);
      isUsingFallback = true;
      redisClient = new FallbackMemoryCache();
    }
  });

  // Attempt initial quick connect non-blocking
  redisClient.connect().catch((err) => {
    if (!isUsingFallback) {
      console.warn(`⚠️ [Redis Warning] Connection failed (${err.message}). Switched to resilient memory cache.`);
      isUsingFallback = true;
      redisClient = new FallbackMemoryCache();
    }
  });
} catch (error) {
  console.warn('⚠️ [Redis Init] Using resilient fallback cache:', error.message);
  redisClient = new FallbackMemoryCache();
  isUsingFallback = true;
}

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Cache get error, returning null:', err.message);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  try {
    const serialized = JSON.stringify(value);
    await redisClient.set(key, serialized, 'EX', ttlSeconds);
    return true;
  } catch (err) {
    console.warn('Cache set error:', err.message);
    return false;
  }
};

export const getRedisStatus = () => {
  return {
    provider: isUsingFallback ? 'In-Memory Resilient Cache' : 'Redis (ioredis)',
    connected: true,
    ttlDefault: parseInt(process.env.REDIS_TTL || '3600', 10)
  };
};

export default redisClient;
