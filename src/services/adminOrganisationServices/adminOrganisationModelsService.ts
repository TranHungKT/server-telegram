import {
  CreateNewAdminOrganisationPayload,
  IAdminOrganisation,
  SchemaWithId,
} from '@Models'

export interface IAdminOrganisationService {
  createNewAdminOrganisation(
    payload: CreateNewAdminOrganisationPayload,
  ): Promise<SchemaWithId<IAdminOrganisation>>

  isAdminOrganisationExist(email: string): Promise<boolean>
}
