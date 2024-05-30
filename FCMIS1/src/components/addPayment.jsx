import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const addpayment = () => {
  const navigate = useNavigate();
  const { memberID } = useParams();
  const [packageID, setPackageID] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [packages, setPackage] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/package")
      .then((result) => {
        if (result.data.Status) {
          setPackage(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) =>
        console.log("There was an error fetching the packages!", err)
      );
  }, []);

  const makePayment = () => {
    axios
      .post("http://localhost:3000/auth/payment", {
        memberID,
        packageID,
        amount,
        date,
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
  };

  return (
    
      <div class='grid grid-flow-row auto-rows-max space-y-4'>
        <h2 className='flex justify-left font-bold text-lg pb-6'>Make Payment</h2>
        <div className='w-full max-w-s'>
        <label className="flex justify-left" htmlFor="username1">
          Member ID
        </label>
        <input
          type="text"
          value={memberID}
          readOnly
          placeholder="Member ID"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="flex justify-left" htmlFor="username1">
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

        <label className="flex justify-left" htmlFor="username1">
          Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="flex justify-left" htmlFor="username1">
          Expire date
        </label>
        <input
          type="date"
          name="expiredate"
          autoComplete="off"
          value={date}
          placeholder=""
          onChange={(e) => setDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div class='space-y-10 space-x-10'>
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

export default addpayment;
