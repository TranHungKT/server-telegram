import {
  Organisation,
  CreateNewOrganisationPayload,
  EditStatusOrganisationPayload,
  IOrganisation,
} from '@Models'
import { ConflictDatabaseError } from '@Utils'
import { IOrganisationService } from './orgnisationModelsService'

import { ORGANISATION_ERRORS } from '@Constants'

class DefaultOrganisationService implements IOrganisationService {
  constructor() {}

  async createNewOrganisation(payload: CreateNewOrganisationPayload) {
    const newOrganisation = new Organisation(payload)

    newOrganisation.save()
    return newOrganisation
  }

  async isOrganisationExist(organisationEmail: string): Promise<boolean> {
    const organisation = await Organisation.findOne({
      organisationEmail: organisationEmail,
    })

    return !!organisation
  }

  async isOrganisationExistById(id: string): Promise<boolean> {
    const organisation = await Organisation.findOne({ _id: id })

    return !!organisation
  }

  async isContactPersonHaveAlreadyHadAdminRole(
    contactPersonEmail: string,
  ): Promise<boolean> {
    const contactPerson = await Organisation.findOne({ contactPersonEmail })

    return !!contactPerson
  }

  async findAndUpdateOrganisationStatus(
    payload: EditStatusOrganisationPayload,
  ): Promise<IOrganisation> {
    const { organisationId, newStatus } = payload

    const organisation = await Organisation.findByIdAndUpdate(organisationId, {
      organisationStatus: newStatus,
    })

    if (!organisation) {
      throw new ConflictDatabaseError(
        ORGANISATION_ERRORS.ORGANISATION_NOT_EXIST,
      )
    }
    return organisation
  }
}

export const organisationService = new DefaultOrganisationService()
