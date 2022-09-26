import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';

export const normalizedUser = (user: HydratedDocument<IUser>) => {
  const { _id, avatarUrl, firstName, lastName } = user;

  return {
    _id,
    name: `${firstName} ${lastName}`,
    avatar: avatarUrl,
  };
};
