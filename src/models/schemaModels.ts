import { Schema, model } from 'mongoose';

import { SCHEMA_NAME } from '@Constants';
import { GroupSchema, MessageSchema, UserSchema } from '@Schemas';

import { TypeOfGroup } from './groupModels';
import { UserStatus } from './userModels';

export interface IUser {
  oAuthId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  groupUserBelongTo: string[];
  status: UserStatus;
}

export const UserModel = model<IUser>(SCHEMA_NAME.USER, UserSchema);

export interface IGroup {
  members: string[];
  messages: {
    _id: string;
    lastUpdatedAt: Date;
  }[];
  typeOfGroup: TypeOfGroup;
  lastUpdatedAt?: Date;
  lastMessage?: string;
}

export const GroupModel = model<IGroup>(SCHEMA_NAME.GROUP, GroupSchema);

export interface IMessage {
  text?: string;
  createdAt: Date;
  user: Schema.Types.ObjectId;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  seen?: boolean;
  image?: string;
}

export const MessageModel = model<IMessage>(SCHEMA_NAME.MESSAGE, MessageSchema);
