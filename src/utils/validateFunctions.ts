import { ValidationError, SchemaOf } from 'yup'

import { RequestValidationPayloadError } from './customsError'

export const validateRequest = async <T>(payload: T, schema: SchemaOf<T>) => {
  try {
    await schema.validate(payload)
  } catch (error) {
    const validationError = error as ValidationError
    throw new RequestValidationPayloadError(
      validationError.message,
      validationError.path,
    )
  }
}
