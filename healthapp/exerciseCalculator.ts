interface ResultObject {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (hours: number[], target: number): ResultObject => {
  const totalHours = hours.reduce((acc, cur) => acc + cur, 0);
  const avgHours = totalHours / hours.length;
  const rating =
    avgHours >= target ? 3 :
    avgHours >= target * 0.6 ? 2 : 1;
  const ratingDesc =
    rating === 3 ? 'amazing work hitting the target' :
    rating === 2 ? 'not too bad but could be better' : 'not a good period';


  return {
    periodLength: hours.length,
    trainingDays: hours.filter(day => day !== 0).length,
    success: rating === 3,
    rating: rating,
    ratingDescription: ratingDesc,
    target: target,
    average: avgHours
  };
};


if (process.argv[1] === import.meta.filename) {
  try {
    const t: number = Number(process.argv[2]);
    const h: number[] = [];
    for (let i = 3; i < process.argv.length; i++) {
      h.push(Number(process.argv[i]));
    }
    console.log(calculateExercises(h, t));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
