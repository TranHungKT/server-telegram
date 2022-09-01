import * as yup from 'yup'
import { MIN_NUMBER_OF_MEMBER_IN_GROUP } from '@Constants'
export const yupCreateNewGroupSchema = yup.object({
  memberIds: yup
    .array(yup.string().required())
    .required()
    .min(MIN_NUMBER_OF_MEMBER_IN_GROUP),
})

export type CreateNewGroupPayload = yup.Asserts<typeof yupCreateNewGroupSchema>