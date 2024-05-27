import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const member = () => {

  const [member, setMember] = useState([])
  const [Package, setPackages] = useState([])
  const navigate = useNavigate()

  useEffect(() =>{
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleDelete = (memberID) =>{
    axios.delete('http://localhost:3000/auth/delete_member/'+memberID)
    .then(result =>{
      if (result.data.Status){
        window.location.reload()
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))
  }

  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Members</h3>
      </div>
      <Link
        to="/dashboard/add_member"
        class="flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Member
      </Link>

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
        <thead class="">
          <tr>
            <th class="py-3">ID</th>
            <th class="py-3">Name</th>
            <th class="py-3">Username</th>
            <th class="py-3">Email</th>
            <th class="py-3">Contact</th>
            <th class="py-3">Gender</th>
            <th class="py-3">DOB</th>
            <th class="py-3">Package</th>
            <th class="py-3">Personal<br></br> Training</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            member.map((m, index) => (
              <tr key={index}>
                <td class="py-2">{m.memberID}</td>
                <td>{m.name}</td>
                <td>{m.username}</td>
                <td>{m.email}</td>
                <td>{m.contact}</td>
                <td>{m.gender}</td>
                <td>{formatDate(m.dob)}</td>
                <td>{getPackageName(m.packageID)}</td>
                <td>{m.personal}</td>
                <td>
                  <Link to= {"/dashboard/edit_member/"+m.memberID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Edit</Link>
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(m.memberID)}>
                    Delete</button>
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

export default member;
