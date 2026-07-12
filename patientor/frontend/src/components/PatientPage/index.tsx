import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import { useParams } from "react-router-dom";
import type { Patient, Diagnosis, Entry } from "../../types";
import { Gender } from "../../types";
import EntryDetails from "./entries.tsx";
import AddEntryForm from "./addEntryForm.tsx";
import { Button } from "@mui/material";

const PatientPage = () => {
  const params = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [showEntryForm, setShowEntryForm] = useState<boolean>(false);

  useEffect(() => {
    if (params.id) {
      void patientService.getById(params.id).then(patient => setPatient(patient));
    }
  }, [params.id]);

  useEffect(() => {
    void diagnoseService.getAll().then(diagnoses => setDiagnoses(diagnoses));
  }, []);

  if (!patient || !diagnoses) {
    return <h3>Loading...</h3>;
  }

  const genderIcon = patient.gender === Gender.Male
    ? <MaleIcon />
    : patient.gender === Gender.Female
      ? <FemaleIcon />
      : <TransgenderIcon />;

  const onEntryAdded = (entry: Entry) => {
    setPatient(patient => patient
      ? { ...patient, entries: patient.entries.concat(entry) }
      : patient
    );
  };

  return (
    <div>
      <h2>{patient.name} {genderIcon}</h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>
      <h4>entries</h4>
      {patient.entries.map(entry =>
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      )}
      {!showEntryForm &&
        <Button variant="contained" onClick={() => setShowEntryForm(!showEntryForm)}>
          Add new entry
        </Button>
      }
      {showEntryForm &&
        <AddEntryForm
          diagnoses={diagnoses}
          setShowForm={setShowEntryForm}
          patientId={patient.id}
          onEntryAdded={onEntryAdded}
        />
      }
    </div>
  );
};

export default PatientPage;
