import { NextFunction, Request, Response } from 'express';

import { userService } from '@Services';
import { validateRequest } from '@Utils';

import { GetUserDataPayload, yupGetUserDataSchema } from './helpers';

export const getUserDataController = async (
  req: Request<{}, {}, {}, GetUserDataPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.query, yupGetUserDataSchema);
    const userResponse = await userService.findUserById(req.query.id);

    return res.status(200).send({
      _id: userResponse._id,
      email: userResponse.email,
      firstName: userResponse.firstName,
      lastName: userResponse.lastName,
      avatarUrl: userResponse.avatarUrl,
    });
  } catch (error) {
    return next(error);
  }
};
