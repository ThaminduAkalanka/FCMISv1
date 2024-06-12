import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { Link } from 'react-router-dom';

const scanQR = () => {
  const [memberID, setMemberID] = useState(null);
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data && data[0] && data[0].rawValue) {
      const parsedData = data[0].rawValue;
      setMemberID(parsedData);
      try {
        const response = await axios.post('http://localhost:3000/auth/mark_attendance', { memberID: parsedData });
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error marking attendance:", error);
        setMessage("Error marking attendance");
      }

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("Error scanning QR code");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div><Link to="/dashboard/attendance" class='flex flex-col w-44 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mb-8'>View Attendance</Link>
      </div>
      <h2 className="text-2xl font-bold mb-16">Scan QR Code to Mark Attendance</h2>
      <div className="w-80 mb-16">
        <Scanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        {memberID && <p className="mt-4">Member ID: {memberID}</p>}
        {message && <p className="mt-2">{message}</p>}
        </div>
        
      </div>
      
    
    
  );
};

export default scanQR;
