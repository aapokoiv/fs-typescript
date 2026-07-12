import type { Entry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry, Diagnosis } from '../../types.ts';
import { HealthCheckRating } from '../../types.ts';

import { Box } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircleIcon from '@mui/icons-material/Circle';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const healthRatingIcon = (rating: HealthCheckRating) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon style={{ color: 'green' }} />;
    case HealthCheckRating.LowRisk:
      return <CircleIcon style={{ color: 'yellow' }} />;
    case HealthCheckRating.HighRisk:
      return <HeartBrokenIcon style={{ color: 'red' }} />;
    case HealthCheckRating.CriticalRisk:
      return <MonitorHeartIcon style={{ color: 'red' }} />;
  }
};

const DiagnosisList = ({ diagnosisCodes, diagnoses }: { diagnosisCodes?: Array<Diagnosis['code']>, diagnoses: Diagnosis[] }) => {
  if (!diagnosisCodes) {
    return null;
  }
  const diagnosisNameByCode = Object.fromEntries(
    diagnoses.map(d => [d.code, d.name])
  );
  return (
    <div>
      {diagnosisCodes.map(code =>
      <div key={code}>
        {code} {diagnosisNameByCode[code]}
      </div>)}
    </div>
  );
};

const HealthCheck = ({ entry, diagnoses }: { entry: HealthCheckEntry, diagnoses: Diagnosis[] }) => {
  return (
    <Box sx={{border: 1, borderColor: "text.primary", borderRadius: 1, p: 1, mb: 1,}}>
      <div>{entry.date} <MedicalInformationIcon /></div>
      <div><em>{entry.description}</em></div>
      <div>diagnose by {entry.specialist}</div>
      <div>{healthRatingIcon(entry.healthCheckRating)}</div>
      <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
    </Box>
  );
};

const OccupationalHealthcare = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry, diagnoses: Diagnosis[] }) => {
  return (
    <Box sx={{border: 1, borderColor: "text.primary", borderRadius: 1, p: 1, mb: 1,}}>
      <div>{entry.date} <MedicalServicesIcon /> {entry.employerName}</div>
      <div><em>{entry.description}</em></div>
      <div>diagnose by {entry.specialist}</div>
      <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      {entry.sickLeave && <div>sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</div>}
    </Box>
  );
};

const Hospital = ({ entry, diagnoses }: { entry: HospitalEntry, diagnoses: Diagnosis[] }) => {
  return (
    <Box sx={{border: 1, borderColor: "text.primary", borderRadius: 1, p: 1, mb: 1,}}>
      <div>{entry.date} <LocalHospitalIcon /></div>
      <div><em>{entry.description}</em></div>
      <div>diagnose by {entry.specialist}</div>
      <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      <div>discharged: {entry.discharge.date} {entry.discharge.criteria}</div>
    </Box>
  );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheck entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} diagnoses={diagnoses} />;
    case "Hospital":
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
