import { MIN_PAGE } from '@Constants'
import * as yup from 'yup'

export const yupGetListMessagesSchema = yup.object({
  groupId: yup.string().required(),
  pageNumber: yup.string().required(),
  pageSize: yup.string().required().min(MIN_PAGE),
})

export type GetListMessagePayload = yup.Asserts<typeof yupGetListMessagesSchema>
