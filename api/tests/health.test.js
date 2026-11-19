import './setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /health', () => {
  it('returns 200 and reports the database as ok', async () => {
    const res = await request(app).get('/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.database, 'ok');
  });
});

describe('unknown routes', () => {
  it('returns 404 with a JSON error', async () => {
    const res = await request(app).get('/does-not-exist');

    assert.equal(res.status, 404);
    assert.equal(res.body.error.message, 'Route GET /does-not-exist not found');
  });
});
