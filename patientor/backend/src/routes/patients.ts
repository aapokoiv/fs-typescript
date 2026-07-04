import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { NewPatientEntry, PatientEntry } from '../types.ts';
import { newPatientParser, errorMiddleware } from '../utils/middleware.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  const data = patientService.getNonSensitiveEntries();
  res.send(data);
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<PatientEntry>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;
