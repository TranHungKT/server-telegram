import redisClient from '../redis'
import { DatabaseError } from '../utils/'

export const setRedisValue = (key: string, value: string) => {
  try {
    redisClient.set(key, value)
  } catch (error) {
    throw new DatabaseError()
  }
}

export const getRedisValue = async (
  key: string,
  callback: (value: string, error: boolean) => void,
) => {
  redisClient.get(key, (err, value) => {
    if (err || !value) {
      return callback('', true)
    }

    return callback(JSON.parse(value).accessToken, false)
  })
}
