import { IGroup } from '@Models'
import { HydratedDocument } from 'mongoose'
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
  createNewGroup(newGroupData: IGroup): Promise<HydratedDocument<IGroup>>
  findListOfGroupsByIdsAndGetMemberInfo(
    payload: GetListOfGroupsByIdsAndGetMemberInfo,
  ): Promise<HydratedDocument<IGroup>[]>
}
