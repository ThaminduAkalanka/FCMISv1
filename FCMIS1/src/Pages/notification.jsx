import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const memberID = localStorage.getItem('memberID'); // Assuming you store the member ID in local storage

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`http://localhost:3000/mem/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(result => {
      if (result.data.Status) {
        setNotifications(result.data.Notifications);
      } else {
        alert(result.data.Error);
      }
    })
    .catch(err => console.log(err));
  }, [memberID]);

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Notifications</h3>
      </div>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-6 pt-6 pb-8 mb-4">
        <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
          <thead>
            <tr>
              <th className="py-3">Date</th>
              <th className="py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {
              notifications.map((n, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{new Date(n.date).toLocaleDateString()}</td>
                  <td>{n.message}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notifications;
