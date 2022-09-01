import { IUser } from '@Models'

export const generateNameOfGroup = (groupOfUsers: IUser[]) => {
  let name = ''

  groupOfUsers.forEach((user) => {
    name = `${name}, ${user.firstName} ${user.lastName}`
  })

  return name.substring(1)
}
