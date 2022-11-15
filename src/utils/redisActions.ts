import redisClient from '../redis';

export const setRedisValue = (key: string, value: string) => {
  try {
    redisClient.set(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getRedisValue = async (key: string) => {
  try {
    console.log('valuueueue');
    const value = await redisClient.get(key);
    console.log('value', value);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    throw new Error('Key not exist');
  }
};
