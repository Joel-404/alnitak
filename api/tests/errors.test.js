import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { validateBody } from '../src/middlewares/validate.js';
import { notFound } from '../src/middlewares/not-found.js';
import { errorHandler } from '../src/middlewares/error-handler.js';
import { HttpError } from '../src/utils/http-error.js';

const buildApp = () => {
  const app = express();
  app.use(express.json());

  const schema = z.object({ email: z.email() });
  app.post('/echo', validateBody(schema), (req, res) => res.json(req.body));
  app.get('/conflict', () => {
    throw new HttpError(409, 'Conflict');
  });
  app.get('/crash', async () => {
    throw new Error('unexpected');
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
};

const app = buildApp();

describe('validateBody', () => {
  it('rejects invalid fields with per-field details', async () => {
    const res = await request(app).post('/echo').send({ email: 'not-an-email' });

    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.email);
  });

  it('strips fields that are not in the schema', async () => {
    const res = await request(app).post('/echo').send({ email: 'a@b.co', role: 'admin' });

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { email: 'a@b.co' });
  });

  it('explains the error when the body is missing', async () => {
    const res = await request(app).post('/echo');

    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.body);
  });

  it('explains the error when the body is an array', async () => {
    const res = await request(app).post('/echo').send([1, 2]);

    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.body);
  });
});

describe('errorHandler', () => {
  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{bad json');

    assert.equal(res.status, 400);
    assert.equal(res.body.error.message, 'Malformed JSON body');
  });

  it('returns 413 when the body is too large', async () => {
    const res = await request(app)
      .post('/echo')
      .send({ email: 'a@b.co', padding: 'x'.repeat(200_000) });

    assert.equal(res.status, 413);
  });

  it('returns the status of an HttpError without details', async () => {
    const res = await request(app).get('/conflict');

    assert.equal(res.status, 409);
    assert.deepEqual(res.body, { error: { message: 'Conflict' } });
  });

  it('hides internal errors behind a generic 500', async (t) => {
    t.mock.method(console, 'error', () => {});
    const res = await request(app).get('/crash');

    assert.equal(res.status, 500);
    assert.equal(res.body.error.message, 'Internal server error');
  });
});
