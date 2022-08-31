export interface IsGroupdUnExistProps {
  ids: string[]
  shouldThrowErrorWhenExist: boolean
  message?: string
}

export interface IGroupService {
  validateGroupExist(payload: IsGroupdUnExistProps): Promise<void>
}
