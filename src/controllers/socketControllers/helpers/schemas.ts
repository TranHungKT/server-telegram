import * as yup from 'yup';

export const yupSendNewMessage = yup.object({
  text: yup.string(),
  user: yup.string().required(),
  image: yup.string(),
});

export type SendNewMessagePayload = yup.Asserts<typeof yupSendNewMessage>;
