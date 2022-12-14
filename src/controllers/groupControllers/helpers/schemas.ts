import * as yup from 'yup';

import { MIN_NUMBER_OF_MEMBER_IN_GROUP } from '@Constants';

export const yupCreateNewGroupSchema = yup.object({
  memberIds: yup
    .array(yup.string().required())
    .required()
    .min(MIN_NUMBER_OF_MEMBER_IN_GROUP),
});

export type CreateNewGroupPayload = yup.Asserts<typeof yupCreateNewGroupSchema>;

export const yupGetListOfGroupSchema = yup.object({
  pageSize: yup.string().required(),
  pageNumber: yup.string().required(),
});

export type GetListGroupQuery = yup.Asserts<typeof yupGetListOfGroupSchema>;

export const yupGetFilesOfGroup = yup.object({
  groupId: yup.string().required(),
});

export type GetFilesOfGroupPayload = yup.Asserts<typeof yupGetFilesOfGroup>;

export const yupDeleteGroup = yup.object({
  groupId: yup.string().required(),
});

export type DeleteGroupQuery = yup.Asserts<typeof yupDeleteGroup>;
