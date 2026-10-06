import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      connected: dbState === 1,
    },
    message: 'Backend server is up and running!',
  });
});

export default router;
