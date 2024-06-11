const btnStyles = `self-start font-medium transition-all hover:text-red`;

function Categories() {
  return (
    <div className="flex flex-col gap-4 bg-neutral-600 p-6">
      <h3
        className="relative pb-2 text-xl font-bold 
before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red"
      >
        Categories
      </h3>
      <button className={btnStyles}>&rsaquo; Body Building</button>
      <button className={btnStyles}>&rsaquo; Strength</button>
      <button className={btnStyles}>&rsaquo; Crossfit</button>
      <button className={btnStyles}>&rsaquo; Cardio</button>
      <button className={btnStyles}>&rsaquo; Flexibility</button>
      <button className={btnStyles}>&rsaquo; Yoga</button>
    </div>
  );
}

export default Categories;
