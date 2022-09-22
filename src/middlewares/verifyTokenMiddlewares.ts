// How to validate
// Require: AccessToken need to be attached in authorization header of request
// Step to do:
// Step 1: If token undefined, return Unauthozied
// Step 2: Get userData from facebook API with accessToken
// Step 3: Use the id from facebook to get data in our database
// Step 4: Attach user data into req.user
import { NextFunction, Request, Response } from 'express';

import { UNAUTHORIZED_MESSAGE } from '@Constants';
import { facebookServices, userService } from '@Services';
import { APIError } from '@Utils';

export const verifyTokenMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token === undefined) {
      throw new APIError(UNAUTHORIZED_MESSAGE);
    }

    const { id } = await facebookServices.getUserData(token);

    const user = await userService.findUserByOAuthId(id);

    req.user = user;

    return next();
  } catch (error) {
    next(error);
  }
};
