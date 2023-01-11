// HOW TO GET LIST OF MESSAGE
// STEP 1: Validate in the query, we need to have groupId, and pageSize, pageNumber
// STEP 2: Validate user request need to have this group
// STEP 3: Populate list message in group, then sort by date. After that, populate user data.
// STEP 4: Normalized the response and send for user
import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';
import { groupServices } from '@Services';
import { validateRequest } from '@Utils';

import {
  GetListMessagePayload,
  normalizedResponseMessage,
  validateUserExistInGroup,
  yupGetListMessagesSchema,
} from './helpers';

export const getMessagesController = async (
  req: Request<{}, {}, {}, GetListMessagePayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id } = req.user as HydratedDocument<IUser>;
    const { groupId, pageNumber, pageSize } = req.query;

    await validateRequest(req.query, yupGetListMessagesSchema);

    const groupUserBelongTo = await groupServices.findGroupById(groupId);

    validateUserExistInGroup({
      groupMembers: groupUserBelongTo?.members,
      userId: _id.toString(),
    });

    const response = await groupServices.getListMessages({
      groupId,
      pageNumber,
      pageSize,
    });

    if (response.length === 0) {
      return res.status(200).send({
        groupId: groupId,
        count: 0,
        list: [],
      });
    }

    const normalizedResponse = normalizedResponseMessage(response[0]);
    const totalChatCount = await groupServices.getTotalChatCount(groupId);

    return res.status(200).send({
      groupId: groupId,
      count: totalChatCount,
      list: normalizedResponse,
    });
  } catch (error) {
    return next(error);
  }
};
