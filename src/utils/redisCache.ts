import redisClient from '../config/redis';

export const setCache = async (key: string, value: any, ttlInSeconds = 3600): Promise<void> => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttlInSeconds });
};

export const getCache = async (key: string): Promise<any | null> => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};
