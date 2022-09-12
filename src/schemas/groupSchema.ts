import { Schema } from 'mongoose'
import { TypeOfGroup, IGroup } from '@Models'
import { SCHEMA_NAME } from '@Constants'

export const GroupSchema = new Schema<IGroup>({
  members: [{ type: Schema.Types.ObjectId, ref: SCHEMA_NAME.USER }],
  chats: [
    {
      id: String,
      content: String,
      contentType: String, // TODO: CHECK TYPE OF FILE, URL?
      sentTime: String,
      sentBy: String,
      readBy: [String],
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
