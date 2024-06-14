import React from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceReport = () => {
  const location = useLocation();
  const { report, startDate, endDate } = location.state || {};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Report</h1>
      {startDate && endDate && (
        <p className="text-gray-500 mb-4">Date Range: {startDate} to {endDate}</p>
      )}
      {report ? (
        <table className="min-w-full bg-white text-black border border-gray-200 shadow-md rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b">Member ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Attendance Count</th>
            </tr>
          </thead>
          <tbody>
            {report.Result.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{item.memberID}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.attendanceCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );
};

export default AttendanceReport;
