import { OAUTH_TYPE, USER_REDIS_KEY, UNAUTHORIZED_MESSAGE } from '@Constants'
import { APIError, getRedisValue } from '@Utils'
import { NextFunction, Request, Response } from 'express'

export const verifyTokenMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (token === undefined) {
      throw new APIError(UNAUTHORIZED_MESSAGE)
    }

    await getRedisValue(
      token + OAUTH_TYPE + USER_REDIS_KEY,
      (accessToken, error) => {
        if (error) {
          return next(new APIError(UNAUTHORIZED_MESSAGE))
        }
        if (token === accessToken) {
          return next()
        }

        return next(new APIError(UNAUTHORIZED_MESSAGE))
      },
    )
  } catch (error) {
    next(error)
  }
}
