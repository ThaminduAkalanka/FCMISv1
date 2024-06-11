import SecondaryHeading from "../headings/SecondaryHeading";
import TertiaryHeading from "../headings/TertiaryHeading";

function Title() {
  return (
    <div className="relative z-20">
      <SecondaryHeading>Latest offers</SecondaryHeading>
      <TertiaryHeading>Exclusive Packages</TertiaryHeading>
      <p className="mx-auto max-w-[50ch] font-medium text-gray-800">
        Muscle Max Fitness Kingdom offers an Ultimate Bundle designed to enhance fitness goals.
      </p>
    </div>
  );
}

export default Title;
