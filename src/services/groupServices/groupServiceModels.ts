import { IGroup, SchemaWithId } from '@Models'

export interface ValidateGroupExistPayload {
  ids: string[]
  shouldThrowErrorWhenExist: boolean
  message?: string
}

export interface IGroupService {
  validateGroupExist(payload: ValidateGroupExistPayload): Promise<void>
  createNewGroup(newGroupData: IGroup): Promise<SchemaWithId<IGroup>>
  findListOfGroupsByIds(ids: string[]): Promise<SchemaWithId<IGroup>[]>
}
