import { z } from 'zod';

export interface DiagnoseEntry {
  code: string,
  name: string,
  latin?: string
};

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;

export interface PatientEntry extends NewPatientEntry {
  id: string;
};

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;
