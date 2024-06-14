import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    fetchAttendance(currentPage);
  }, [currentPage]);

  const fetchAttendance = (page) => {
    axios.get(`http://localhost:3000/auth/attendance?page=${page}&limit=${recordsPerPage}`)
      .then(result => {
        if (result.data.Status) {
          setAttendance(result.data.Result);
          setTotalPages(result.data.TotalPages);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/auth/delete_attendance/${id}`)
      .then(result => {
        if (result.data.Status) {
          fetchAttendance(currentPage);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // Use 12-hour clock format
    };

    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Attendance</h3>
      </div>
      <Link to="/dashboard/scanqr" className='flex-1 w-44 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
        Mark Attendance
      </Link>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
        <input
          type="text"
          placeholder="Search"
          className="flex w-40 h-6 focus:outline-none text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        />
        <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
          <thead className="">
            <tr>
              <th className="py-3">Attendance ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Check-In Time</th>
              <th className="py-3">Check-out Time</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              attendance.map((p, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{formatDate(p.checkinTime)}</td>
                  <td>{formatDate(p.checkoutTime)}</td>
                  <td>
                    <button className="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                      onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
  
      </div>
      <div className="flex justify-center mt-4 space-x-2">
          {
            Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`flex w-4 h-5 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded text-xs px-1 py-1 ${currentPage === index + 1 ? 'bg-neutral-400' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))
          }
        </div>
    </div>
  );
};

export default Attendance;
