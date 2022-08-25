import {
  CreateNewOrganisationPayload,
  EditStatusOrganisationPayload,
  IOrganisation,
  SchemaWithId,
} from '@Models'

export interface IOrganisationService {
  createNewOrganisation(
    payload: CreateNewOrganisationPayload,
  ): Promise<SchemaWithId<IOrganisation>>

  isOrganisationExist(organisationName: string): Promise<boolean>
  isContactPersonHaveAlreadyHadAdminRole(
    contactPersonEmail: string,
  ): Promise<boolean>
  isOrganisationExistById(id: string): Promise<boolean>

  findAndUpdateOrganisationStatus(
    payload: EditStatusOrganisationPayload,
  ): Promise<IOrganisation>
}
