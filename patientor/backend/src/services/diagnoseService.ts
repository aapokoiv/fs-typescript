import diagnoseData from '../../data/diagnoses.ts';
import type { DiagnoseEntry } from '../types.ts';

const getEntries = (): DiagnoseEntry[] => {
  return diagnoseData;
};

export default {
  getEntries
};
