// How to get list groups
// Step to do
// Step 1: it need to pass validate token
// Step 2: Use ObjectId from req.user and query for list of groups, using groups belong to
// Step 3: Return list of group with the following response type
// {
//   count: number,
//   list: IGroup[]
// }

import { IUser, SchemaWithId } from '@Models'
import { groupServices } from '@Services'
import { Request, Response, NextFunction } from 'express'

export const getListGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { groupUserBelongTo } = req.user as SchemaWithId<IUser>

    const listOfGroups = await groupServices.findListOfGroupsByIds(
      groupUserBelongTo,
    )
    return res.status(200).send({
      count: listOfGroups.length,
      list: listOfGroups,
    })
  } catch (error) {
    return next(error)
  }
}
