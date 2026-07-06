import type { CoursePart } from '../types.ts';

interface PartProps {
  course: CoursePart;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  const base = (
    <p key={props.course.name} style={{marginBottom: "0px"}}>
      <strong>{props.course.name} {props.course.exerciseCount}</strong>
    </p>
  );

  switch (props.course.kind) {
    case "basic":
      return (
        <div>
          {base}
          <p style={{margin: "0px"}}>
            <em>{props.course.description}</em>
          </p>
        </div>
      )
    case "group":
      return (
        <div>
          {base}
          <p style={{margin: "0px"}}>
            project exercises: {props.course.groupProjectCount}
          </p>
        </div>
      )
    case "background":
      return (
        <div>
          {base}
          <p style={{margin: "0px"}}>
            <em>{props.course.description}</em>
          </p>
          <p style={{margin: "0px"}}>
            {props.course.backgroundMaterial}
          </p>
        </div>
      )
    case "special":
      return (
        <div>
          {base}
          <p style={{margin: "0px"}}>
            <em>{props.course.description}</em>
          </p>
          <p style={{margin: "0px"}}>
            required skills: {props.course.requirements.map(req => `${req}, `)}
          </p>
        </div>
      )
    default:
      return assertNever(props.course)
  }
}

export default Part;
