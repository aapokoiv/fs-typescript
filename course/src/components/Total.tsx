import type { CoursePart } from '../types.ts';

interface TotalProps {
  courseParts: CoursePart[];
};

const Total = (props: TotalProps) => {
  const totalExercises = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return (
    <div style={{marginTop: "16px"}}>
      Number of exercises {totalExercises}
    </div>
  );
};

export default Total;
