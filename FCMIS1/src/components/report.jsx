import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleAttendanceReportSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.get('http://localhost:3000/auth/attendancereport', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      console.log(response.data);
      
      // Navigate to the attendance report page with data as state
      navigate('/dashboard/attendancereport', { state: { report: response.data } });
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    }
  };

  const handleIncomeReportSubmit = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/incomereport', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      console.log(response.data);
      
      // Navigate to the income report page with data as state
      navigate('/dashboard/incomereport', { state: { report: response.data } });
    } catch (error) {
      console.error('Error fetching income report:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <form onSubmit={handleAttendanceReportSubmit} className="bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-white text-sm font-bold mb-2">Start Date:</label>
          <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-white text-sm font-bold mb-2">End Date:</label>
          <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Get Attendance Report
          </button>
          <button 
            type="button" 
            onClick={handleIncomeReportSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Get Income Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report;
