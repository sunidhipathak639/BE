import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// ✅ Correct event listeners
redisClient.on('connect', () => {
  console.log('🔌 Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

// ✅ Immediately connect on import
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

export default redisClient;
