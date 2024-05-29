import React, { useState, useEffect } from "react";
import axios from "axios";

const payments = () => {
  const [memberID, setMemberID] = useState("");
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
        date
      })
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div>
      <div>
        <h2>Make Payment</h2>

        <label className="flex justify-left" htmlFor="username1">
          Member ID
        </label>
        <input
          type="text"
          value={memberID}
          onChange={(e) => setMemberID(e.target.value)}
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
        <button onClick={makePayment}>Pay</button>
      </div>
    </div>
  );
};

export default payments;
