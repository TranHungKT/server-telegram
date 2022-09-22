import { GROUP_NOT_EXIST, GROUP_NOT_HAVE_THIS_USER } from '@Constants';
import { ConflictDatabaseError } from '@Utils';

export const validateUserExistInGroup = ({
  groupMembers,
  userId,
}: {
  userId: string;
  groupMembers?: string[];
}) => {
  if (!groupMembers) {
    throw new ConflictDatabaseError(GROUP_NOT_EXIST);
  }

  if (!groupMembers.includes(userId)) {
    throw new ConflictDatabaseError(GROUP_NOT_HAVE_THIS_USER);
  }
};
