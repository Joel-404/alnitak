import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

router.get('/', async (req, res) => {
  let database = 'ok';

  try {
    await pool.query('SELECT 1');
  }  catch (err) {
    console.error('Health check database error:', err.message);
    database = 'unreachable';
  }

  const healthy = database === 'ok';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    database,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;