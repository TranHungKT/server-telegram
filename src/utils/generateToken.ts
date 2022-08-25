import jwt from 'jsonwebtoken'

// TODO: MAKE TOKEN_ERROR
import { RequestValidationPayloadError } from './customsError'
import { setRedisValue } from './redisActions'

interface PayloadToken {
  email: string
}
const USER_REDIS_KEY = '_USER_REDIS_KEY'

export const decodeOTPToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, `${process.env.SECRET_OTP_TOKEN_JWT}`)
    return decoded
  } catch (err) {
    throw new RequestValidationPayloadError('Something went wrong')
  }
}

export const decodeAccessToken = (token: string): PayloadToken => {
  try {
    const decoded = jwt.verify(
      token,
      `${process.env.SECRET_ACCESS_TOKEN_JWT}`,
    ) as PayloadToken

    return decoded
  } catch (err) {
    throw new RequestValidationPayloadError('Something went wrong')
  }
}

export const decodeRefreshToken = (token: string): PayloadToken => {
  try {
    const decoded = jwt.verify(
      token,
      `${process.env.SECRET_REFRESH_TOKEN_JWT}`,
    ) as PayloadToken

    return decoded
  } catch (err) {
    throw new RequestValidationPayloadError('Something went wrong')
  }
}

export const generateAndSaveTokenToRedis = (payload: {
  email: string
  accessToken: string
  refreshToken: string
  type: string
}): { accessToken: string; refreshToken: string } => {
  const { email, refreshToken, accessToken, type } = payload

  setRedisValue(
    email + type + USER_REDIS_KEY,
    JSON.stringify({ accessToken, refreshToken }),
  )

  return { accessToken, refreshToken }
}
