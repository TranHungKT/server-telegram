import { GroupModel } from '@Models'
import { ConflictDatabaseError } from '@Utils'
import { IGroupService, IsGroupdUnExistProps } from './groupServiceModels'

class DefaultGroupService implements IGroupService {
  constructor() {}

  async validateGroupExist({
    ids,
    shouldThrowErrorWhenExist,
    message = 'This Group Already Exist',
  }: IsGroupdUnExistProps): Promise<void> {
    const response = await GroupModel.find({
      memberIds: ids,
    })
    if (!!response.length === shouldThrowErrorWhenExist) {
      throw new ConflictDatabaseError(message)
    }
  }
}

export const groupServices = new DefaultGroupService()
