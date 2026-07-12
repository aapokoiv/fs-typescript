import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.ts';
import type { NonSensitivePatient, NewPatientEntry, Patient, NewEntry, Entry } from '../types.ts';

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    entries: [],
    ...entry
  };

  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const getPatientById = (id: string): Patient | undefined => {
  return patientData.find(patient => patient.id === id);
};

const addEntry = (entry: NewEntry, patientId: string): Entry | undefined => {
  const newEntry = {
    id: uuid(),
    ...entry
  };

  const patient = patientData.find(patient => patient.id === patientId);

  if (!patient) {
    return undefined;
  }

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getPatientById,
  addEntry
};
