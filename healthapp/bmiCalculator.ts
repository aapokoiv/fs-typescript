export const calculateBmi = (height: number, mass: number): string => {
  if (!Number.isFinite(height) || !Number.isFinite(mass)) {
    throw new Error('malformatted parameters');
  }
  const meters = height / 100;
  const bmi = mass / (meters * meters);
  if (bmi < 18.5) {
    return 'underweight';
  } else if (bmi < 25) {
    return 'normal range';
  } else if (bmi < 30) {
    return 'overweight';
  } else {
    return 'obese';
  }
};


if (process.argv[1] === import.meta.filename) {
  try {
    const h: number = Number(process.argv[2]);
    const m: number = Number(process.argv[3]);
    console.log(calculateBmi(h, m));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
