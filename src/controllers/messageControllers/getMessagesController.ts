// HOW TO GET LIST OF MESSAGE
// STEP 1: Validate in the query, we need to have groupId, and pageSize, pageNumber
// STEP 2: Validate user request need to have this group
// STEP 3: Populate list message in group, then sort by date. After that, populate user data.
// STEP 4: Normalized the response and send for user

import { Request, Response, NextFunction } from 'express'
import { validateRequest } from '@Utils'
import {
  yupGetListMessagesSchema,
  GetListMessagePayload,
} from './helpers/schema'
import { validateUserExistInGroup } from './helpers/validations'
import { IUser } from '@Models'
import { HydratedDocument } from 'mongoose'
import { groupServices } from '@Services'

import { normalizedResponseMessage } from './helpers/utils'

export const getMessagesController = async (
  req: Request<{}, {}, {}, GetListMessagePayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id } = req.user as HydratedDocument<IUser>
    await validateRequest(req.query, yupGetListMessagesSchema)
    const { groupId, pageNumber, pageSize } = req.query
    const groupUserBelongTo = await groupServices.findGroupById(groupId)

    validateUserExistInGroup({
      groupMembers: groupUserBelongTo?.members,
      userId: _id.toString(),
    })

    const response = await groupServices.getListMessages({
      groupId,
      pageNumber,
      pageSize,
    })

    if (response.length === 0) {
      res.status(200).send({
        count: 0,
        list: [],
      })
    }

    const normalizedResponse = normalizedResponseMessage(response[0])
    const totalChatCount = await groupServices.getTotalChatCount(groupId)

    return res.status(200).send({
      count: totalChatCount,
      list: normalizedResponse,
    })
  } catch (error) {
    return next(error)
  }
}
