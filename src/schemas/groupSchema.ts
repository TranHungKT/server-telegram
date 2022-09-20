import { Schema } from 'mongoose'
import { TypeOfGroup, IGroup } from '@Models'
import { SCHEMA_NAME } from '@Constants'

export const GroupSchema = new Schema<IGroup>({
  members: [{ type: Schema.Types.ObjectId, ref: SCHEMA_NAME.USER }],
  messages: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: SCHEMA_NAME.MESSAGE,
      },
      lastUpdatedAt: {
        type: Date,
        default: new Date(),
        required: true,
      },
    },
  ],
  typeOfGroup: {
    type: String,
    enum: TypeOfGroup,
    required: true,
  },
  lastUpdatedAt: {
    type: Date,
    default: new Date(),
    required: false,
  },
})
