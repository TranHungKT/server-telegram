import { Request } from 'express';

export interface RequestUserAfterAuthenticate extends Request {
  user: {
    accessToken: string;
  };
}

export enum UserStatus {
  OFFLINE = 1,
  ONLINE,
}
