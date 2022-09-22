import { Schema } from 'mongoose'
import { IMessage } from '@Models'
import { SCHEMA_NAME } from '@Constants'

export const MessageSchema = new Schema<IMessage>({
  text: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: SCHEMA_NAME.USER,
  },
  sent: Boolean,
  received: Boolean,
  pending: Boolean,
})