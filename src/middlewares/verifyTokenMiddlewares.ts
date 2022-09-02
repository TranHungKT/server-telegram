// How to validate
// Require: AccessToken need to be attached in authorization header of request
// Step to do:
// Step 1: If token undefined, return Unauthozied
// Step 2: Get userData from facebook API with accessToken
// Step 3: Use the id from facebook to get data in our database
// Step 4: Attach user data into req.user

import { UNAUTHORIZED_MESSAGE } from '@Constants'
import { APIError } from '@Utils'
import { NextFunction, Response, Request } from 'express'
import { facebookServices, userService } from '@Services'

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

    const userDataFromFacebook = await facebookServices.getUserData(token)

    const user = await userService.findUserByOAuthId(userDataFromFacebook.id)

    req.user = user

    return next()
  } catch (error) {
    next(error)
  }
}
