const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    console.log(part.exercises, sum);
    return sum + part.exercises;
  }, 0);

  return <p>Number of exercises: {total}</p>;
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);
export default Course;
