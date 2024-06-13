import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MembershipStatus = () => {
  const [member, setMember] = useState([]);
  const [membership, setMembership] = useState([]);
  const [Package, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/membershipstatus')
      .then(result => {
        if (result.data.Status) {
          setMembership(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    axios.get('http://localhost:3000/auth/member')
      .then(result => {
        if (result.data.Status) {
          setMember(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    axios.get('http://localhost:3000/auth/package')
      .then(result => {
        if (result.data.Status) {
          setPackages(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  const getPackageName = (packageID) => {
    const pkg = Package.find(p => p.packageID === packageID);
    return pkg ? pkg.packageName : 'Unknown';
  };

  const getName = (memberID) => {
    const mem = member.find(s => s.memberID === memberID);
    return mem ? mem.name : 'Unknown';
  };

  const handleDelete = (memberID) => {
    axios.delete('http://localhost:3000/auth/delete_membership/' + memberID)
      .then(result => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  const handleSendNotification = (memberID, message) => {
    axios.post(`http://localhost:3000/auth/sendNotification/${memberID}`, { message })
      .then(result => {
        if (result.data.Status) {
          alert(result.data.Message);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Membership Status</h3>
      </div>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-6 pt-6 pb-8 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="flex w-40 h-6 focus:outline-none text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        />
        <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
          <thead>
            <tr>
              <th className="py-3">ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Package</th>
              <th className="py-3">Start Date</th>
              <th className="py-3">Expire Date</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              membership.map((m, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{m.memberID}</td>
                  <td>{getName(m.memberID)}</td>
                  <td>{getPackageName(m.packageID)}</td>
                  <td>{formatDate(m.startDate)}</td>
                  <td>{formatDate(m.endDate)}</td>
                  <td style={{ color: m.status === 'active' ? 'lime' : m.status === 'pending' ? 'yellow' : 'red' }}>
                    {m.status}
                  </td>
                  <td>
                    <Link to={`/dashboard/add_payment/${m.memberID}`} className="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2">
                      Add Payment
                    </Link>
                    <button className="flex-1 w-12 h-6 focus:outline-none text-white bg-red-600 hover:bg-red-700 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2"
                      onClick={() => {
                        const today = new Date();
                        const expireDate = new Date(m.endDate);
                        if (expireDate < today) {
                          handleSendNotification(m.memberID, "Your membership has expired.");
                        } else if ((expireDate - today) / (1000 * 60 * 60 * 24) <= 7) {
                          handleSendNotification(m.memberID, "Your membership is about to expire in the next 7 days.");
                        } else {
                          alert("Membership is not expiring soon or already expired");
                        }
                      }}>
                      Notify
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembershipStatus;
