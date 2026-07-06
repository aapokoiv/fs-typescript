import type { CoursePart } from '../types.ts';
import Part from './Part.tsx';

interface ContentProps {
  courseParts: CoursePart[];
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map(course =>
        <Part key={course.name} course={course} />
      )}
    </div>
  );
};

export default Content;
