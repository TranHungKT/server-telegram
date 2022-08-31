import { ConflictDatabaseError } from '@Utils'

export const isListOfMemebersConflict = (memberIds: string[]) => {
  memberIds.forEach((id) => {
    if (memberIds.filter((memberId) => memberId === id).length >= 2) {
      throw new ConflictDatabaseError(
        'There are more than 2 conflict id in request',
      )
    }
  })
}
