import { z } from 'zod';
import { HttpError } from '../utils/http-error.js';

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);
    const details = formErrors.length > 0 ? { body: formErrors } : fieldErrors;
    throw new HttpError(400, 'Invalid request body', details);
  }

  req.body = result.data;
  next();
};
