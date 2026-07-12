import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { NewPatientEntry, Patient, NewEntry, Entry } from '../types.ts';
import { newPatientParser, errorMiddleware, newEntryParser } from '../utils/middleware.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  const data = patientService.getNonSensitiveEntries();
  res.send(data);
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    res.status(404).end();
    return;
  }
  res.send(patient);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, Entry, NewEntry>, res: Response<Entry>) => {
  const addedEntry = patientService.addEntry(req.body, req.params.id);
  if (!addedEntry) {
    res.status(400).end();
    return;
  }
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;
