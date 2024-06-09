import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const memberSchedule = () => {

  const [member, setMember] = useState([])
  const [membership, setMembership] = useState([])
  const [Package, setPackages] = useState([])
  const navigate = useNavigate()

  useEffect(() =>{
    axios.get('http://localhost:3000/auth/membershipstatus')
    .then(result =>{
      if (result.data.Status){
        setMembership(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/auth/member')
    .then(result =>{
      if (result.data.Status){
        setMember(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/auth/package')
    .then(result =>{
      if (result.data.Status){
        setPackages(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))
  },[])

  const getPackageName = (packageID) => {
    const pkg = Package.find(p => p.packageID === packageID)
    return pkg ? pkg.packageName : 'Unknown'
  }

  const getName = (memberID) => {
    const mem = member.find(s => s.memberID === memberID)
    return mem ? mem.name : 'Unknown'
  }


  const handleDelete = (memberID) =>{
    axios.delete('http://localhost:3000/auth/delete_membership/'+memberID)
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
      return '-'; // Return an empty string if the date is null or undefined
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Membership Status</h3>
      </div>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4">
      <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
        <thead class="">
          <tr>
            <th class="py-3">ID</th>
            <th class="py-3">Name</th>

            <th class="py-3">Package</th>
            {/*<th class="py-3">Personal<br></br> Training</th>*/}
            <th class="py-3">Start Date</th>
            <th class="py-3">Expire Date</th>
            <th class="py-3">Status</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            membership.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td class="py-2">{m.memberID}</td>
                <td>{getName(m.memberID)}</td>

                <td>{getPackageName(m.packageID)}</td>
                {/*<td>{m.personal}</td>*/}
                <td>{formatDate(m.startDate)}</td>
                <td>{formatDate(m.endDate)}</td>
                <td style={{ color: m.status === 'active' ? 'lime' : m.status === 'pending' ? 'yellow' : 'red' }}>
                  {m.status}
                </td>
                <td>
                  <Link to= {"/dashboard/add_payment/"+m.memberID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Assign Schedule</Link>
                  {/*<button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(m.memberID)}>
                    Delete</button>*/}
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

export default memberSchedule;
