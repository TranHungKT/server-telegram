import 'dotenv/config';
import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

export default redisClient;
