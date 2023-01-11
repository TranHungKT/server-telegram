import { NextFunction, Request, Response } from 'express';

import { groupServices } from '@Services';
import { validateRequest } from '@Utils';

import {
  GetFilesOfGroupPayload,
  normalizedResponseMessageImage,
  yupGetFilesOfGroup,
} from './helpers';

export const getFilesOfGroupController = async (
  req: Request<{}, {}, {}, GetFilesOfGroupPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.query, yupGetFilesOfGroup);

    const { groupId } = req.query;
    const response = await groupServices.getFilesOfGroup({
      groupId,
    });

    if (response.length === 0) {
      return res.status(200).send([]);
    }

    const normalizedResponse = normalizedResponseMessageImage(response[0]);

    return res.status(200).send(normalizedResponse);
  } catch (error) {
    return next(error);
  }
};
