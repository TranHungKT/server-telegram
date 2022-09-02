import { IUser } from '@Models'
declare namespace Express {
  export interface Request {
    user: IUser
  }
}
