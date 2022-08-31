// How to create an group
// Require: There is at least 2 members.
// Validate:
// Step 1: There is no group have the same number of member and same ids.
// Step 2: Can not have same ids in req.body
// Step 3: All Ids are valid.
// Step 4: Name is default by Name of each user.
// Step 5: Create New group
// Step 6: Add _id of group to groupUserBelongTo to all users in memberIds

import { Request, Response, NextFunction } from 'express'
import { validateRequest } from '@Utils'
import {
  CreateNewGroupPayload,
  yupCreateNewGroupSchema,
} from './helpers/schemas'
import { generateNameOfGroup } from './helpers/utils'
import { isListOfMemebersConflict } from './helpers/validates'
import { GroupModel, IGroup, TypeOfGroup } from '@Models'
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
    const groupOfUser = await userService.findUsersByIds(memberIds)

    // Step 5
    const nameOfGroup = generateNameOfGroup(groupOfUser)

    const newGroup: IGroup = {
      name: nameOfGroup,
      memberIds: memberIds,
      chats: [],
      typeOfGroup: TypeOfGroup.ALL,
    }

    // Step 5
    const newGroupAfterCreation = await new GroupModel(newGroup).save()

    // Step 6
    await userService.addGroupIdToListUser({
      memberIds,
      groupId: newGroupAfterCreation._id.toString(),
    })

    return res.status(201).send(newGroupAfterCreation)
  } catch (error) {
    return next(error)
  }
}
