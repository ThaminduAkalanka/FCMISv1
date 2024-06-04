import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Member = () => {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    axios.get('http://localhost:3000/auth/package')
      .then(result => {
        if (result.data.Status) {
          setPackages(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  const fetchMembers = (query = '') => {
    const url = query ? `http://localhost:3000/auth/search_member?query=${query}` : 'http://localhost:3000/auth/member1';
    axios.get(url)
      .then(result => {
        if (result.data.Status) {
          setMembers(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  const getPackageName = (packageID) => {
    const pkg = packages.find(p => p.packageID === packageID);
    return pkg ? pkg.packageName : 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  const handleDelete = (memberID) => {
    axios.delete('http://localhost:3000/auth/delete_member/' + memberID)
      .then(result => {
        if (result.data.Status) {
          fetchMembers(); // Refresh the list after deletion
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchMembers(e.target.value);
  };

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Members</h3>
      </div>

      <Link
        to="/dashboard/add_member"
        className="flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Add Member
      </Link>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="flex w-40 h-6 focus:outline-none text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        />
        <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
          <thead className="">
            <tr>
              <th className="py-3">ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Username</th>
              <th className="py-3">Email</th>
              <th className="py-3">Contact</th>
              <th className="py-3">Gender</th>
              <th className="py-3">DOB</th>
              <th className="py-3">Package</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{m.memberID}</td>
                <td>{m.name}</td>
                <td>{m.username}</td>
                <td>{m.email}</td>
                <td>{m.contact}</td>
                <td>{m.gender}</td>
                <td>{formatDate(m.dob)}</td>
                <td>{getPackageName(m.packageID)}</td>
                <td style={{ color: m.status === 'active' ? 'lime' : m.status === 'pending' ? 'yellow' : 'red' }}>
                  {m.status}
                </td>
                <td className="space-x-2">
                  <Link to={"/dashboard/edit_member/" + m.memberID} className="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-2 py-1 me-2 mb-2">
                    Edit
                  </Link>
                  {/* <button className="text-red-600 hover:underline" onClick={() => handleDelete(m.memberID)}>
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        {members.length > membersPerPage && (
          <ul className="flex list-none">
            {Array.from({ length: Math.ceil(members.length / membersPerPage) }, (_, index) => (
              <li key={index} className="mx-1">
                <button onClick={() => paginate(index + 1)} className="px-3 py-1 rounded-lg bg-neutral-400 text-white">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Member;
