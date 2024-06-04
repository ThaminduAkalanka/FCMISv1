import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const attendance = () => {

    const [attendance, setAttendance] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/attendance')
      .then(result =>{
        if (result.data.Status){
          setAttendance(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    },[]) /*there are 3 types of use effect*/


    const handleDelete = (id) =>{
      axios.delete('http://localhost:3000/auth/delete_attendance/'+id)
      .then(result =>{
        if (result.data.Status){
          window.location.reload()
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    }

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

  return (
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Attendance</h3>
      </div>
      <Link to="/dashboard/scanqr" class='flex-1 w-44 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Mark Attendance</Link> 

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Attendance ID</th>
            <th class="py-3">Name</th>
            <th class="py-3">Check-In Time</th>
            <th class="py-3">Check-out Time</th>
            <th class="py-3">Action</th>
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
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(p.id)}>
                    Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
    
    
    </div>
  )
}

export default attendance
