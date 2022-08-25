import { Document, Types } from 'mongoose'

export type SchemaWithId<T> = Document<unknown, any, T> &
  T & {
    _id: Types.ObjectId
  }
