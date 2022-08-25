import redisClient from '../redis'
import { DatabaseError } from '../utils/'

export interface IRedisValue {
  accessToken?: string
  refreshToken?: string
}

export const setRedisValue = (key: string, value: string) => {
  try {
    redisClient.set(key, value)
  } catch (error) {
    throw new DatabaseError()
  }
}

export const getRedisValue = async (
  key: string,
  callback: (value: IRedisValue) => void,
) => {
  try {
    redisClient.get(key, (err, value) => {
      if (err) {
        throw new DatabaseError()
      }

      return callback(JSON.parse(value || ''))
    })
  } catch (error) {
    throw new DatabaseError()
  }
}
