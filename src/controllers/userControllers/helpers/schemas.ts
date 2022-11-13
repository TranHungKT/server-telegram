import * as yup from 'yup';

export const yupGetConnectionStatusSchema = yup.object({
  ids: yup.array(yup.string().required()).required(),
});

export type GetConnectionStatusPayload = yup.Asserts<
  typeof yupGetConnectionStatusSchema
>;
