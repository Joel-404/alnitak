import { after } from 'node:test';
import { env } from '../src/config/env.js';
import { pool } from '../src/db/pool.js';

if (env.nodeEnv !== 'test' || !env.databaseUrl.includes('_test')) {
  throw new Error('Tests must run with NODE_ENV=test against a *_test database');
}

after(async () => {
  await pool.end();
});
