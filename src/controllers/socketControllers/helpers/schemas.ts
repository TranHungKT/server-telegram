import * as yup from 'yup'

export const yupSendNewMessage = yup.object({
  text: yup.string().required(),
  user: yup.string().required(),
})

export type SendNewMessagePayload = yup.Asserts<typeof yupSendNewMessage>
