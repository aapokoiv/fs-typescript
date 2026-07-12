import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Diagnosis, Entry, HealthCheckRating as HealthCheckRatingValue } from '../../types.ts';
import { HealthCheckRating } from '../../types.ts';
import patientService from '../../services/patients.ts';
import Notification from '../Notification.tsx';
import axios from 'axios';

type EntryType = Entry['type'];

interface AddEntryFormProps {
  diagnoses: Diagnosis[];
  setShowForm: Dispatch<SetStateAction<boolean>>;
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
}

const healthCheckRatingOptions = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low risk' },
  { value: HealthCheckRating.HighRisk, label: 'High risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical risk' },
];

const AddEntryForm = ({ diagnoses, setShowForm, patientId, onEntryAdded }: AddEntryFormProps) => {
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRatingValue>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [message, setMessage] = useState('');

  const handleTypeChange = (event: SelectChangeEvent<EntryType>) => {
    setEntryType(event.target.value as EntryType);
  };

  const handleDiagnosisCodeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const commonValues = {
      date,
      description,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    const values = entryType === 'HealthCheck'
      ? { ...commonValues, type: entryType, healthCheckRating }
      : entryType === 'OccupationalHealthcare'
        ? {
          ...commonValues,
          type: entryType,
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd
            ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
            : undefined,
        }
        : {
          ...commonValues,
          type: entryType,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
    try {
      const addedEntry = await patientService.createEntry(patientId, values);
      onEntryAdded(addedEntry);
      setShowForm(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error;

        if (Array.isArray(backendError)) {
          setMessage(
            backendError
              .map(issue => {
                const field = issue.path?.join('.');
                return field ? `${field}: ${issue.message}` : issue.message;
              })
              .join(', ')
          );
        } else if (typeof backendError === 'string') {
          setMessage(backendError);
        }
      } else {
        setMessage('Failed adding entry');
      }
    };
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 2,
        p: 2,
      }}
    >
      <Typography variant="h6" component="h3">
        New entry
      </Typography>
      <Notification message={message} />

      <FormControl fullWidth>
        <InputLabel id="entry-type-label">Entry type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={entryType}
          label="Entry type"
          onChange={handleTypeChange}
        >
          <MenuItem value="HealthCheck">Health check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational healthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Description"
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        fullWidth
        multiline
        minRows={2}
      />

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={({ target }) => setDate(target.value)}
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        label="Specialist"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={diagnosisCodes}
          input={<OutlinedInput label="Diagnosis codes" />}
          renderValue={(selected) => selected.join(', ')}
          onChange={handleDiagnosisCodeChange}
        >
          {diagnoses.map(diagnosis => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />
              <ListItemText primary={`${diagnosis.code} ${diagnosis.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {entryType === 'HealthCheck' && (
        <FormControl fullWidth>
          <InputLabel id="health-check-rating-label">Health check rating</InputLabel>
          <Select
            labelId="health-check-rating-label"
            value={String(healthCheckRating)}
            label="Health check rating"
            onChange={({ target }) => setHealthCheckRating(Number(target.value) as HealthCheckRatingValue)}
          >
            {healthCheckRatingOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            label="Employer name"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            fullWidth
          />
          <TextField
            label="Sick leave start"
            type="date"
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Sick leave end"
            type="date"
            value={sickLeaveEnd}
            onChange={({ target }) => setSickLeaveEnd(target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </>
      )}

      {entryType === 'Hospital' && (
        <>
          <TextField
            label="Discharge date"
            type="date"
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Discharge criteria"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            fullWidth
          />
        </>
      )}
      <div>
        <Button variant="contained" type="submit">
          Add
        </Button>
        <Button variant="outlined" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </Box>
  );
};

export default AddEntryForm;
