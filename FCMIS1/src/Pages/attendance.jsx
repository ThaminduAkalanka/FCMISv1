import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroPages from "../components/hero-pages/HeroPages";


const ViewAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchDate, setSearchDate] = useState('');

  const [data, setData] = useState({
    totalMembers: null,
    activeMembers: null,
    trainers: null,
    equipments: null,
    presentMembers: null,
    earnings: null,
});

  const fetchAttendances = (page = 1, date = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    axios.get(`http://localhost:3000/mem/attendance?page=${page}&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.status) {
          setAttendances(response.data.attendances);
          setMonthlyCount(response.data.monthlyCount);
          setTotalPages(response.data.pages);
          setCurrentPage(response.data.currentPage);
        } else {
          console.error("Error fetching attendance data");
        }
      })
      .catch(error => {
        console.error("There was an error fetching the attendance data!", error);
      });
  };

  useEffect(() => {
    fetchAttendances();

    axios.get('http://localhost:3000/auth/dashboard-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
  }, []);

  const handlePageChange = (newPage) => {
    fetchAttendances(newPage, searchDate);
  };

  const handleSearch = () => {
    fetchAttendances(1, searchDate);
  };

  return (
    <main>
      <HeroPages page="Attendance" />
      <div className="flex p-4 justify-center">
        <div className="w-full lg:w-3/4 mt-10">
        <p className="mt-2 text-3xl font-bold text-green-500">Live Member count at the gym: {data.presentMembers}</p>
          <p className="mb-4 text-3xl font-bold mt-6 text-center">Number of attendance in this month: {monthlyCount}</p>
          
          <div className="overflow-x-auto mb-4 mt-10">
            <h2 className="py-4 text-2xl text-center">Attendance Record History</h2>
            <div className="mb-4 flex items-center justify-center">
              <input 
                type="date" 
                value={searchDate} 
                onChange={(e) => setSearchDate(e.target.value)} 
                className="p-2 border text-black border-gray-300 rounded-md" 
              />
              <button 
                onClick={handleSearch} 
                className="ml-2 p-2 bg-red-600 text-white rounded-md"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-neutral-600 rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">AttendanceID</th>
                  <th className="px-4 py-2 border-b">Check-in Time</th>
                  <th className="px-4 py-2 border-b">Check-out Time</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-4 py-2 border-b text-center text-white">{attendance.id}</td>
                    <td className="px-4 py-2 border-b text-center text-white">{new Date(attendance.checkinTime).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b text-center text-white">{attendance.checkoutTime ? new Date(attendance.checkoutTime).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-white text-black' : 'bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default ViewAttendance;
