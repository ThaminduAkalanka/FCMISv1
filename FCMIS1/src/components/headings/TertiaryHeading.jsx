function TertiaryHeading({ color = "black", children }) {
  return (
    <h3
      className={`mb-5 text-4xl font-bold capitalize ${
        color === "black" ? "text-black" : ""
      }`}
    >
      {children}
    </h3>
  );
}

export default TertiaryHeading;
