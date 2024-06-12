import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeroPages from "../components/hero-pages/HeroPages";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [member, setMember] = useState(null);
  const [error, setError] = useState(null);
  const [Package, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    axios
      .get("http://localhost:3000/mem/memberschedule", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.Status) {
          setMember(response.data.member);
        } else {
          setError(response.data.Error);
        }
      })
      .catch((err) =>
        setError("An error occurred while fetching the profile data.")
      );

    axios
      .get("http://localhost:3000/auth/package")
      .then((result) => {
        if (result.data.Status) {
          setPackages(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/train/manageschedule")
      .then((result) => {
        if (result.data.Status) {
          setSchedule(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!member) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const handleSchedule = () => {
    const token = localStorage.getItem("token");
    axios.put('http://localhost:3000/mem/updateschedule', {
      memberID: member.memberID,
      scheduleStatus: "completed",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.data.Status) {
          window.location.reload();
        } else {
          alert(response.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options);
  };

  const getPackageName = (packageID) => {
    const pkg = Package.find((p) => p.packageID === packageID);
    return pkg ? pkg.packageName : "Unknown";
  };

  const getScheduleName = (scheduleID) => {
    const s = schedule.find((p) => p.scheduleID === scheduleID);
    return s ? s.name : "Unknown";
  };

  const getScheduleDetail = (scheduleID) => {
    const s = schedule.find((p) => p.scheduleID === scheduleID);
    if (!s || !s.scheduleDetail) {
      return ["Unknown"];
    }
    return s.scheduleDetail.split("\n");
  };

  return (
    <main className="bg-gray-100 min-h-screen ">
      <HeroPages page="Schedule" />

      <h1 className="text-2xl font-bold text-neutral-800 mt-16 mb-4">
        Current Schedule
      </h1>
      <div className="max-w-2xl mx-auto mt-6 ">
        <div className="bg-neutral-800 shadow-lg rounded-lg p-8 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-lg">
                <span className="font-semibold">Schedule:</span>{" "}
                {getScheduleName(member.scheduleID)}
              </p>
              <div className="flex text-lg space-x-2">
                <span className="font-semibold">Status:</span>
                <div
                  style={{
                    color:
                      member.scheduleStatus === "completed"
                        ? "lime"
                        : member.scheduleStatus === "in progress"
                        ? "yellow"
                        : "red",
                  }}
                >
                  {member.scheduleStatus}
                </div>
              </div>
            </div>

            <div>
              <p className="text-lg">
                <span className="font-semibold">Start Date:</span>{" "}
                {formatDate(member.startDate)}
              </p>
              <p className="text-lg">
                <span className="font-semibold">End Date:</span>{" "}
                {formatDate(member.endDate)}
              </p>
            </div>
          </div>

          <div className="text-lg text-left mt-4">
            <span className="font-semibold">Schedule Details:</span>
            <ul className="pl-8 mt-2">
              {getScheduleDetail(member.scheduleID).map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-3 mt-10">
          <p className="text-neutral-800">Please update Schedule Status when you have completed it.</p>
          <button
            onClick={handleSchedule}
            className="bg-red-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-red-700"
          >
            Update
          </button>
        </div>
        <br></br>
      </div>
      <div className="mt-8"></div>
    </main>
  );
}

export default Schedule;
