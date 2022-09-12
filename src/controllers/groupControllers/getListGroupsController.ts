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
import { GetListGroupQuery, yupGetListOfGroupSchema } from './helpers/schemas'
import { validateRequest } from '@Utils'

export const getListGroupsController = async (
  req: Request<{}, {}, {}, GetListGroupQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.query, yupGetListOfGroupSchema)

    const { groupUserBelongTo } = req.user as SchemaWithId<IUser>
    const { pageNumber, pageSize } = req.query

    const listOfGroups =
      await groupServices.findListOfGroupsByIdsAndGetMemberInfo({
        ids: groupUserBelongTo,
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
      })

    return res.status(200).send({
      count: groupUserBelongTo.length,
      list: listOfGroups,
    })
  } catch (error) {
    return next(error)
  }
}
