import { ConflictDatabaseError } from '@Utils'

export const validateUserExistInGroup = ({
  groupMembers,
  userId,
}: {
  userId: string
  groupMembers?: string[]
}) => {
  if (!groupMembers) {
    throw new ConflictDatabaseError('This group does not exist')
  }

  if (!groupMembers.includes(userId)) {
    throw new ConflictDatabaseError('This group does not include this user')
  }
}
