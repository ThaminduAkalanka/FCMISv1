import SecondaryHeading from "../headings/SecondaryHeading";
import TertiaryHeading from "../headings/TertiaryHeading";

function Title() {
  return (
    <div className="text-center">
      <SecondaryHeading>Latest</SecondaryHeading>
      <TertiaryHeading>Recent Announcements</TertiaryHeading>
      <p className="mx-auto max-w-[50ch] font-medium text-neutral-100">
        Muscle Max Fitness Kingdom Annoucements.
      </p>
    </div>
  );
}

export default Title;
