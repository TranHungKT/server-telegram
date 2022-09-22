import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';

export const getBaseUserController = async (req: Request, res: Response) => {
  const user = req.user as HydratedDocument<IUser>;

  return res.status(200).send({
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
  });
};
