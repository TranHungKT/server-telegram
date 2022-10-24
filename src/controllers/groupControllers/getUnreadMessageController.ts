// STEP 1: Validate request, need to have list of groupID
// STEP 2: Query list of group and response will like this
// {groupId: string, numberOfUnReadMessage: number}[]
import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';
import { groupServices } from '@Services';
import { validateRequest } from '@Utils';

import {
  GetNumberOfUnReadMessagePayload,
  yupGetNumberOfUnReadMessage,
} from './helpers';

export const getUnReadMessageController = async (
  req: Request<{}, {}, GetNumberOfUnReadMessagePayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.body, yupGetNumberOfUnReadMessage);

    const response = await groupServices.getNumberOfUnReadMessage({
      groupIds: req.body.groupIds,
      userId: (req.user as HydratedDocument<IUser>)._id.toString(),
    });

    return res.status(200).send(response);
  } catch (error) {
    return next(error);
  }
};
