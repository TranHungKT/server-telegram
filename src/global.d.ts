import { IUser, SchemaWithId } from '@Models'
declare namespace Express {
  export interface Request {
    user: SchemaWithId<IUser>
  }
}
