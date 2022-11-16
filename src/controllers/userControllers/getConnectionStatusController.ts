import { NextFunction, Request, Response } from 'express';

import { SOCKET_CONNECT_USERS } from '@Constants';
import { UserStatus } from '@Models';
import { getRedisValue, validateRequest } from '@Utils';

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
    const connectedSocket: string[] = await getRedisValue(SOCKET_CONNECT_USERS);

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
