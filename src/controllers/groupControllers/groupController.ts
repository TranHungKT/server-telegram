// How to create an group
// Require: There is at least 2 members.
// Step to do:
// Step 1: There is no group have the same number of member and same ids.
// Step 2: Can not have same ids in req.body
// Step 3: All Ids are valid.
// Step 4: Create New group
// Step 5: Add _id of group to groupUserBelongTo to all users in memberIds

import { Request, Response, NextFunction } from 'express'
import { validateRequest } from '@Utils'
import {
  CreateNewGroupPayload,
  yupCreateNewGroupSchema,
} from './helpers/schemas'

import { isListOfMemebersConflict } from './helpers/validates'
import { IGroup, TypeOfGroup } from '@Models'
import { groupServices, userService } from '@Services'
export const createNewGroupController = async (
  req: Request<{}, {}, CreateNewGroupPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateRequest(req.body, yupCreateNewGroupSchema)

    const { memberIds } = req.body

    // Step 1
    await groupServices.validateGroupExist({
      ids: req.body.memberIds,
      shouldThrowErrorWhenExist: true,
    })

    // Step 2
    isListOfMemebersConflict(req.body.memberIds)

    // Step 3
    await userService.findUsersByIds(memberIds)

    const newGroup: IGroup = {
      members: memberIds,
      chats: [],
      typeOfGroup: TypeOfGroup.ALL,
    }

    // Step 4
    const newGroupAfterCreation = await groupServices.createNewGroup(newGroup)

    // Step 5
    await userService.addGroupIdToListUser({
      memberIds,
      groupId: newGroupAfterCreation._id.toString(),
    })

    return res.status(201).send(newGroupAfterCreation)
  } catch (error) {
    return next(error)
  }
}
