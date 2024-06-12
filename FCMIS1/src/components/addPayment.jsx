import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddPayment = () => {
  const navigate = useNavigate();
  const { memberID } = useParams();
  const [packageID, setPackageID] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/package")
      .then((result) => {
        if (result.data.Status) {
          setPackages(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) =>
        console.log("There was an error fetching the packages!", err)
      );
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.packageID = packageID ? "" : "Package is required.";
    tempErrors.amount = amount ? "" : "Amount is required.";
    tempErrors.amount = !isNaN(amount) && amount > 0 ? "" : "Amount must be a positive number.";
    tempErrors.startDate = startDate ? "" : "Start date is required.";
    tempErrors.endDate = endDate ? "" : "End date is required.";
    tempErrors.dateRange = new Date(startDate) < new Date(endDate) ? "" : "End date must be after start date.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const makePayment = () => {
    if (validate()) {
      axios
        .post("http://localhost:3000/auth/payment", {
          memberID,
          packageID,
          amount,
          startDate,
          endDate,
        })
        .then((result) => {
          if (result.data.Status) {
            navigate("/dashboard/status");
          } else {
            alert(result.data.Error);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  return (
    <div className="">
      <h2 className="flex justify-left font-bold text-lg pb-6">Make Payment</h2>
      <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded-lg p-6 space-y-3">
        <label className="flex justify-left" htmlFor="memberID">
          Member ID
        </label>
        <input
          type="text"
          value={memberID}
          readOnly
          placeholder="Member ID"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="flex justify-left" htmlFor="packageID">
          Package
        </label>
        <select
          value={packageID}
          onChange={(e) => setPackageID(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg.packageID} value={pkg.packageID}>
              {pkg.packageName} - {pkg.Rate} LKR
            </option>
          ))}
        </select>
        {errors.packageID && <p className="text-red-500 text-xs">{errors.packageID}</p>}

        <label className="flex justify-left" htmlFor="amount">
          Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}

        <label className="flex justify-left" htmlFor="startDate">
          Start date
        </label>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}

        <label className="flex justify-left" htmlFor="endDate">
          Expire date
        </label>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
        {errors.dateRange && <p className="text-red-500 text-xs">{errors.dateRange}</p>}

        <div className="space-y-10 space-x-10">
          <button
            className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={makePayment}
          >
            Pay
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/status")}
            className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
