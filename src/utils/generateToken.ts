import { USER_REDIS_KEY, OAUTH_TYPE } from '@Constants'
import jwt from 'jsonwebtoken'

// TODO: MAKE TOKEN_ERROR
import { RequestValidationPayloadError } from './customsError'
import { setRedisValue } from './redisActions'

interface PayloadToken {
  email: string
}

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

export const saveTokenToRedis = (payload: {
  accessToken: string
}): { accessToken: string } => {
  const { accessToken } = payload

  setRedisValue(
    accessToken + OAUTH_TYPE + USER_REDIS_KEY,
    JSON.stringify({ accessToken }),
  )

  return { accessToken }
}
