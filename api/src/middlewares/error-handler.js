import { HttpError } from '../utils/http-error.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, ...(err.details && { details: err.details }) },
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Malformed JSON body' } });
  }

  if (err.expose && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: { message: err.message } });
  }

  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
};
