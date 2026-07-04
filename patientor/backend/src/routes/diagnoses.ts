import express from 'express';
import diagnoseService from '../services/diagnoseService.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  const data = diagnoseService.getEntries();
  res.send(data);
});

router.post('/', (_req, res) => {
  res.send('');
});

export default router;
