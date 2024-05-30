import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const editPackage = () => {
  const navigate = useNavigate();
  const { packageID } = useParams();

  const [values, setValues] = useState({
    packageName: "",
    Rate: "",
  });


  useEffect(() => {

    axios
      .get(`http://localhost:3000/auth/package/${packageID}`)
      .then((result) => {
        if (result.data.Result && result.data.Result.length > 0) {
          setValues({
            packageName: result.data.Result[0].packageName, 
            Rate: result.data.Result[0].Rate,
          });
        } else {
          alert("Package not found");
          navigate("/dashboard/package");
        }
      })
      .catch((err) => console.log(err));
  }, [packageID]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_package/${packageID}`, values)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/package");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">Edit Package</h2>
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="space-y-3">
            <label className="flex justify-left" htmlFor="packageName">
              Package Name
            </label>
            <input
              type="text"
              name="packageName"
              autoComplete="off"
              placeholder=""
              value={values.packageName}
              onChange={(e) =>
                setValues({ ...values, packageName: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <br />

          <div className="space-y-3">
            <label className="flex justify-left" htmlFor="rate">
              Rate
            </label>
            <input
              type="number"
              name="rate"
              autoComplete="off"
              placeholder=""
              value={values.Rate}
              onChange={(e) => setValues({ ...values, Rate: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/package")}
              className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default editPackage;
