import { IGroup, SchemaWithId } from '@Models'

export interface ValidateGroupExistPayload {
  ids: string[]
  shouldThrowErrorWhenExist: boolean
  message?: string
}

export interface GetListOfGroupsByIdsAndGetMemberInfo {
  ids: string[]
  pageSize: number
  pageNumber: number
}

export interface IGroupService {
  validateGroupExist(payload: ValidateGroupExistPayload): Promise<void>
  createNewGroup(newGroupData: IGroup): Promise<SchemaWithId<IGroup>>
  findListOfGroupsByIdsAndGetMemberInfo(
    payload: GetListOfGroupsByIdsAndGetMemberInfo,
  ): Promise<SchemaWithId<IGroup>[]>
}
