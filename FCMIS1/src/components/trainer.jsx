import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const trainer = () => {

  const [trainer, setTrainer] = useState([])


  useEffect(() =>{
    axios.get('http://localhost:3000/auth/trainer')
    .then(result =>{
      if (result.data.Status){
        setTrainer(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

  },[])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Trainer Details</h3>
      </div>
      <Link
        to="/dashboard/add_trainer"
        class="flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Trainer
      </Link>

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">ID</th>
            <th class="py-3">Name</th>
            <th class="py-3">Username</th>
            <th class="py-3">Contact</th>
            <th class="py-3">Registered Date</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            trainer.map((m, index) => (
              <tr key={index}>
                <td>{m.trainerID}</td>
                <td>{m.name}</td>
                <td>{m.username}</td>
                <td>{m.contact}</td>
                <td>{formatDate(m.registerDate)}</td>
                <td>
                  <button class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Edit</button>
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
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

export default trainer;
