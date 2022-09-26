import { HydratedDocument, Types } from 'mongoose';

import { IMessage, IUser } from './schemaModels';

export interface IMessageAfterPopulateUser extends Omit<IMessage, 'user'> {
  user: HydratedDocument<IUser>;
}

export interface IMessageAfterPopulateUserAndMapForFronEnd
  extends Omit<IMessage, 'user'> {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    avatar: string;
    name: string;
  };
}
