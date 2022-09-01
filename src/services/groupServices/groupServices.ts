import { GroupModel, IGroup, SchemaWithId } from '@Models'
import { ConflictDatabaseError, DatabaseError } from '@Utils'
import { IGroupService, ValidateGroupExistPayload } from './groupServiceModels'

class DefaultGroupService implements IGroupService {
  constructor() {}

  async validateGroupExist({
    ids,
    shouldThrowErrorWhenExist,
    message = 'This Group Already Exist',
  }: ValidateGroupExistPayload): Promise<void> {
    const response = await GroupModel.find({
      memberIds: ids,
    })
    if (!!response.length === shouldThrowErrorWhenExist) {
      throw new ConflictDatabaseError(message)
    }
  }

  async createNewGroup(newGroupData: IGroup): Promise<SchemaWithId<IGroup>> {
    try {
      return await new GroupModel(newGroupData).save()
    } catch (error) {
      throw new DatabaseError()
    }
  }
}

export const groupServices = new DefaultGroupService()
