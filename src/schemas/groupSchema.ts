import { Schema } from 'mongoose'
import { TypeOfGroup, IGroup } from '@Models'

export const GroupSchema = new Schema<IGroup>({
  name: String,
  memberIds: [String],
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
})
