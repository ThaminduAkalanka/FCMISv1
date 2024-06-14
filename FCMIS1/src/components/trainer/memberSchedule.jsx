import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const memberSchedule = () => {

  const [member, setMember] = useState([])
  const [memberschedule, setMemberschedule] = useState([])
  const [Package, setPackages] = useState([])
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  const [schedule, setSchedule] = useState([])

  useEffect(() =>{
    axios.get('http://localhost:3000/train/memberschedule')
    .then(result =>{
      if (result.data.Status){
        setMemberschedule(result.data.Result);
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

    axios.get('http://localhost:3000/train/category')
    .then(result =>{
      if (result.data.Status){
        setCategory(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/train/manageschedule')
    .then(result =>{
      if (result.data.Status){
        setSchedule(result.data.Result);
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
  const getcatName = (categoryID) => {
    const c = category.find(s => s.categoryID === categoryID)
    return c ? c.categoryName : 'Unknown'
  }

  const getscheduleName = (scheduleID) => {
    const c = schedule.find(s => s.scheduleID === scheduleID)
    return c ? c.name : 'Unknown'
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
        <h3>Assign Schedule</h3>
      </div>

      <div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4">
      <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
        <thead class="">
          <tr>
            <th class="py-3">ID</th>
            <th class="py-3">Name</th>

            <th class="py-3">Package</th>
    
            <th class="py-3">Currnet Category</th>
            <th class="py-3">Current Schedule</th>
            <th class="py-3">Schedule Status</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            memberschedule.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td >{m.memberID}</td>
                <td class="py-2">{m.name}</td>
                
                <td>{getPackageName(m.packageID)}</td>
              
                {/*<td>{m.personal}</td>
                <td>{formatDate(m.startDate)}</td>
                <td>{formatDate(m.endDate)}</td>*/}
                <td>{getcatName(m.categoryID)}</td>
                <td>{getscheduleName(m.scheduleID)}</td>
                <td style={{ color: m.scheduleStatus === 'completed' ? 'lime' : m.scheduleStatus === 'in progress' ? 'yellow' : 'red' }}>
                  {m.scheduleStatus}
                </td>
                <td>
                  <Link to= {"/trainerDashboard/assignschedule/"+m.memberID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
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
