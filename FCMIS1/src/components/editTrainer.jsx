import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const editTrainer = () => {
  const navigate = useNavigate();
  const { trainerID } = useParams();

  const [values, setValues] = useState({
    name: "",
    contact: "",
  });


  useEffect(() => {

    axios
      .get(`http://localhost:3000/auth/trainer/${trainerID}`)
      .then((result) => {
        if (result.data.Result && result.data.Result.length > 0) {
          setValues({
            name: result.data.Result[0].name, 
            contact: result.data.Result[0].contact,
          });
        } else {
          alert("trainer not found");
          navigate("/dashboard/trainer");
        }
      })
      .catch((err) => console.log(err));
  }, [trainerID]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_trainer/${trainerID}`, values)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/trainer");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">Edit Trainer</h2>
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="space-y-3">
            <label className="flex justify-left" htmlFor="name">
              name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder=""
              value={values.name}
              onChange={(e) =>
                setValues({ ...values, name: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <br />

          <div className="space-y-3">
          <label className="flex justify-left" htmlFor="contact">
                Contact
              </label>
              <input
                type="tel"
                name="contact"
                autoComplete="off"
                placeholder="Enter Contact Number"
                value={values.contact}
                onChange={(e) => setValues({ ...values, contact: e.target.value })}
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
              onClick={() => navigate("/dashboard/trainer")}
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

export default editTrainer;