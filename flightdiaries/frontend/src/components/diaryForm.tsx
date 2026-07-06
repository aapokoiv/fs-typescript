import { useState } from 'react';
import axios from 'axios';
import type { FormEvent } from 'react';
import { Weather, Visibility, type Diary } from '../types.ts';
import diaryService from '../services/diaryService.ts';

interface DiaryFormProps {
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setDiaries: React.Dispatch<React.SetStateAction<Diary[]>>,
  diaries: Diary[],
}

const DiaryForm = (props: DiaryFormProps) => {
  const { setMessage, setDiaries, diaries } = props;
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('')

  const addDiary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newDiary = {
        date: date,
        visibility: visibility,
        weather: weather,
        comment: comment
    };

    try {
      const addedDiary = await diaryService.create(newDiary)
      setDiaries(diaries.concat(addedDiary))
      setDate('')
      setVisibility('great')
      setWeather('sunny')
      setComment('')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
        setMessage(error.response.data.error[0].message)
        setTimeout(() => {
          setMessage(null)
        }, 5000);
      } else {
        console.error(error);
      }
    };
  }

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={addDiary}>
        <div>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(event) => setDate(event.currentTarget.value)}
          />
        </div>

        <div>
          visibility:{' '}
          {Object.values(Visibility).map(value => (
            <label key={value}>
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={(event) => setVisibility(event.currentTarget.value as Visibility)}
              />
              {value}
            </label>
          ))}
        </div>

        <div>
          weather:{' '}
          {Object.values(Weather).map(value => (
            <label key={value}>
              <input
                type="radio"
                name="weather"
                value={value}
                checked={weather === value}
                onChange={(event) => setWeather(event.currentTarget.value as Weather)}
              />
              {value}
            </label>
          ))}
        </div>

        <div>
          comment:{' '}
          <input
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
