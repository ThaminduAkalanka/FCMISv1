import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const memberStat = () => {
  const [exercises, setExercises] = useState([]);
  const [exerciseID, setExerciseID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("");
  const [report, setReport] = useState([]);
  const [memberID, setMemberID] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/mem/exercise")
      .then((response) => {
        if (response.data.Status) {
          setExercises(response.data.Result);
        } else {
          console.error("Error fetching exercises:", response.data.Error);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the exercises!", error);
      });
  }, []);


  const fetchReport = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3000/train/progressReport",
        { memberID, exerciseID, startDate, endDate, period },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data.Status) {
          setReport(response.data.Result);
        } else {
          console.error("Error fetching report:", response.data.Error);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the report!", error);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options);
  };

  const chartData = {
    labels: report.map((entry) => formatDate(entry.entryDate)),
    datasets: [
      {
        label: "Progress",
        data: report.map((entry) => entry.entryValue),
        fill: false,
        backgroundColor: "white",
        borderColor: "gray",
      },
    ],
  };

  return (
    
     
      <div className="container mx-auto p-4">
        

        <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold my-4 text-white">Member Progress Report</h2>
          <p>Select the Exercise/Type and select a date range or a specific period</p>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-white text-sm font-bold mb-2">Member ID</label>
              <input
                type="text"
                value={memberID}
                onChange={(e) => setMemberID(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm font-bold mb-2">Exercise</label>
              <select
                value={exerciseID}
                onChange={(e) => setExerciseID(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select an exercise</option>
                {Array.isArray(exercises) &&
                  exercises.map((exercise) => (
                    <option key={exercise.exerciseID} value={exercise.exerciseID}>
                      {exercise.exerciseName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm font-bold mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm font-bold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm font-bold mb-2">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select a period</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchReport}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Get Report
          </button>

          <div className="my-4">
            {report.length > 0 ? (
              <>
                <div className="mt-6 bg-white p-4 rounded-lg mb-10">
                  <Line data={chartData} />
                </div>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((entry) => (
                      <tr key={entry.progressID}>
                        <td className="border px-4 py-2">{formatDate(entry.entryDate)}</td>
                        <td className="border px-4 py-2">{entry.entryValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div>No progress data found for the selected criteria.</div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default memberStat;
