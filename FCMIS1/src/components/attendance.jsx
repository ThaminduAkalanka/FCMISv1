import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

const Attendance = () => {
  const [memberID, setMemberID] = useState(null);
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data && data[0] && data[0].rawValue) {
      const parsedData = data[0].rawValue; // Extract the rawValue from the scanned data
      console.log('Parsed memberID:', parsedData); // Log parsed memberID
      setMemberID(parsedData);
      try {
        const response = await axios.post('http://localhost:3000/auth/mark_attendance', { memberID: parsedData });
        console.log('Response:', response); // Log response
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error marking attendance:", error);
        setMessage("Error marking attendance");
      }

      // Refresh the page after 5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 5000); // 10000 milliseconds = 10 seconds
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("Error scanning QR code");
  };

  return (
    <div>
      <h2>Scan QR Code to Mark Attendance</h2>
      <div class='w-96'>
      <Scanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {memberID && <p>Member ID: {memberID}</p>}
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default Attendance;
