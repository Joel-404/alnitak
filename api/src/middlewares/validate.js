import { z } from 'zod';
import { HttpError } from '../utils/http-error.js';

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new HttpError(400, 'Invalid request body', z.flattenError(result.error).fieldErrors);
  }

  req.body = result.data;
  next();
};
