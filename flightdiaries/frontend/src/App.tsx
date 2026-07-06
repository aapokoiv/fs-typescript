import { useState, useEffect } from 'react';
import type { Diary } from './types.ts';
import diaryService from './services/diaryService.ts';
import DiaryForm from './components/diaryForm.tsx';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => setDiaries(initialDiaries))
  }, [])

  if (!diaries) {
    return null
  }

  return (
    <div>
      {message && <div style={{color: "red"}}>Error: {message}</div>}
      {diaries.map(diary =>
      <div key={diary.id}>
        <h3 style={{marginBottom: "0px"}}>{diary.date}</h3>
        weather: {diary.weather}, visibility: {diary.visibility}
      </div>
      )}
      <DiaryForm setMessage={setMessage} setDiaries={setDiaries} diaries={diaries} />
    </div>
  )
}

export default App;
