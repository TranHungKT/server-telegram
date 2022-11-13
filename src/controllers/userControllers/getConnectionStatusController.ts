import { NextFunction, Request, Response } from 'express';

import { UserStatus } from '@Models';
import { validateRequest } from '@Utils';

import { connectedSocket } from '../../socket';
import {
  GetConnectionStatusPayload,
  yupGetConnectionStatusSchema,
} from './helpers';

export const getConnectionStatusController = async (
  req: Request<{}, {}, GetConnectionStatusPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.body, yupGetConnectionStatusSchema);

    const result: Record<string, UserStatus> = {};

    const ids = req.body.ids;

    ids.forEach((id) => {
      if (connectedSocket.includes(id)) {
        result[id] = UserStatus.ONLINE;
      } else {
        result[id] = UserStatus.OFFLINE;
      }
    });

    return res.status(200).send(result);
  } catch (error) {
    return next(error);
  }
};
