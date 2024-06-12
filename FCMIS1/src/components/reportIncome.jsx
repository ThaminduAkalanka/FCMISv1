import React from 'react';
import { useLocation } from 'react-router-dom';

const IncomeReport = () => {
  const location = useLocation();
  const report = location.state?.report;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Income Report</h1>
      {report ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl text-black font-semibold mb-4">Total Income: </h2>
          <p className="text-3xl text-green-600 font-bold">
            {report.Result[0].totalIncome} LKR
          </p>
        </div>
      ) : (
        <p className="text-black">No data available.</p>
      )}
    </div>
  );
};

export default IncomeReport;
