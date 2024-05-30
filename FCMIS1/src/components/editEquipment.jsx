import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const editEquipment = () => {
  const navigate = useNavigate();
  const { equipmentID } = useParams();

  const [values, setValues] = useState({
    equipmentName: "",
    quantity: "",
  });


  useEffect(() => {

    axios
      .get(`http://localhost:3000/auth/equipment/${equipmentID}`)
      .then((result) => {
        if (result.data.Result && result.data.Result.length > 0) {
          setValues({
            equipmentName: result.data.Result[0].equipmentName, 
            quantity: result.data.Result[0].quantity,
          });
        } else {
          alert("equipment not found");
          navigate("/dashboard/equipment");
        }
      })
      .catch((err) => console.log(err));
  }, [equipmentID]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_equipment/${equipmentID}`, values)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/equipment");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">Edit Equipment</h2>
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="space-y-3">
            <label className="flex justify-left" htmlFor="equipmentName">
            Equipment name
            </label>
            <input
              type="text"
              name="equipmentName"
              autoComplete="off"
              placeholder=""
              value={values.equipmentName}
              onChange={(e) =>
                setValues({ ...values, equipmentName: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <br />

          <div className="space-y-3">
          <label className="flex justify-left" htmlFor="contact">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                autoComplete="off"
                placeholder="Enter Quantity"
                value={values.quantity}
                onChange={(e) => setValues({ ...values, quantity: e.target.value })}
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
              onClick={() => navigate("/dashboard/equipment")}
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

export default editEquipment