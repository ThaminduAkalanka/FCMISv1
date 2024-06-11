import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const equipment = () => {

  const [equipment, setEquipment] = useState([])


  useEffect(() =>{
    axios.get('http://localhost:3000/auth/equipment')
    .then(result =>{
      if (result.data.Status){
        setEquipment(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

  },[])

  const handleDelete = (equipmentID) =>{
    axios.delete('http://localhost:3000/auth/delete_equipment/'+equipmentID)
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
        <h3>Equipments</h3>
      </div>
      <Link
        to="/dashboard/add_equipment"
        class="flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Equipment
      </Link>

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <input
          type="text"
          placeholder="Search"
         
          
          className="flex w-40 h-6 focus:outline-none text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        />
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">ID</th>
            <th class="py-3">Name</th>
            <th class="py-3">Quantity</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            equipment.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td>{m.equipmentID}</td>
                <td>{m.equipmentName}</td>
                <td>{m.quantity}</td>
                <td>
                <Link to= {"/dashboard/edit_equipment/"+m.equipmentID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Edit</Link>
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(m.equipmentID)}>
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

export default equipment;
