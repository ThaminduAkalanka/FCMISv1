import { Link } from "react-router-dom";

function Copyright() {
  return (
    <div className="font-medium text-gray-300">
      <p className=" ">
        Privacy Policy | &copy; <span>{new Date().getFullYear()}</span> MuscleMax
      </p>
      <p>
        Designed by{" "}
        <Link
          to="https://github.com/ThaminduAkalanka"
          target="_blank"
          className="focus text-red"
        >
          Thamindu Senanayake
        </Link>
      </p>
    </div>
  );
}

export default Copyright;
