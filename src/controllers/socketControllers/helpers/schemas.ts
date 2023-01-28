import * as yup from 'yup';

export const yupSendNewMessage = yup.object({
  text: yup.string(),
  user: yup.string().required(),
  listImages: yup.array(yup.string().required()).notRequired(),
});

export type SendNewMessagePayload = yup.Asserts<typeof yupSendNewMessage>;
