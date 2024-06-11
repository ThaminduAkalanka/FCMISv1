import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const assignSchedule = () => {
  const navigate = useNavigate();
  const { memberID } = useParams();
  const [trainerID, setTrainerID] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
 
  const [schedule, setSchedule] = useState([])

  useEffect(() =>{
    axios.get('http://localhost:3000/train/manageschedule')
    .then(result =>{
      if (result.data.Status){
        setSchedule(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))
  },[])

  const assignschedule = () => {
    axios
      .post("http://localhost:3000/train/assignschedule", {
        memberID,
        trainerID,
        scheduleID,
        startDate,
        endDate,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/trainerDashboard/memberschedule");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    
      <div class=''>
        <h2 className='flex justify-left font-bold text-lg pb-6'>Assign Schedule</h2>
        <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded-lg p-6 space-y-3">
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
                  Trainer
                </label>
                <input
                  type="text"
                  value={trainerID}
                  onChange={(e) => setTrainerID(e.target.value)}
                  placeholder="Amount"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />


        <label className="flex justify-left" htmlFor="username1">
          Schedule
        </label>
        <select
          value={scheduleID}
          onChange={(e) => setScheduleID(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Select Schedule</option>
          {schedule.map((s) => (
            <option key={s.scheduleID} value={s.scheduleID}>
              {s.name} - {s.level}
            </option>
          ))}
        </select>

       

      <label className="flex justify-left" htmlFor="username1">
          Start date
        </label>
        <input
          type="date"
          name="startdate"
          autoComplete="off"
          value={startDate}
          placeholder=""
          onChange={(e) => setstartDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="flex justify-left" htmlFor="username1">
          Expire date
        </label>
        <input
          type="date"
          name="expiredate"
          autoComplete="off"
          value={endDate}
          placeholder=""
          onChange={(e) => setendDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div class='space-y-10 space-x-10'>
        <button
          className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={assignschedule}
        >
          Add
        </button>

        <button
          type="button"
          onClick={() => navigate("/trainerDashboard/memberschedule")}
          className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900"
        >
          Cancel
        </button>
        </div>
        </div>
      </div>
    
  );
};

export default assignSchedule;
