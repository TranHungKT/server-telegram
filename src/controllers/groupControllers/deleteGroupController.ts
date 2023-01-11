import { NextFunction, Request, Response } from 'express';
import { map } from 'lodash';

import { groupServices, messageService, userService } from '@Services';
import { validateRequest } from '@Utils';

import { DeleteGroupQuery, yupDeleteGroup } from './helpers';

export const deleteGroupController = async (
  req: Request<{}, {}, {}, DeleteGroupQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.query, yupDeleteGroup);

    const { groupId } = req.query;

    const group = await groupServices.findGroupById(groupId);

    await userService.deleteGroupUserBelongTo({
      userIds: group.members,
      groupId: groupId,
    });

    await groupServices.deleteGroupById(groupId);

    await messageService.deleteMessagesByIds({
      messageIds: map(group.messages, '_id'),
    });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
