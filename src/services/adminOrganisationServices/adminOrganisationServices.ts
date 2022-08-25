import {
  IAdminOrganisation,
  SchemaWithId,
  CreateNewAdminOrganisationPayload,
  AdminOrganisation,
} from '@Models'

import { IAdminOrganisationService } from './adminOrganisationModelsService'

class DefaultAdminOrganisationService implements IAdminOrganisationService {
  constructor() {}

  async createNewAdminOrganisation(
    payload: CreateNewAdminOrganisationPayload,
  ): Promise<SchemaWithId<IAdminOrganisation>> {
    const newAdminOrganisation = new AdminOrganisation(payload)

    await newAdminOrganisation.save()
    return newAdminOrganisation
  }

  async isAdminOrganisationExist(email: string): Promise<boolean> {
    const admin = await AdminOrganisation.findOne({ email })

    return !!admin
  }
}

export const adminOrganisationService = new DefaultAdminOrganisationService()
