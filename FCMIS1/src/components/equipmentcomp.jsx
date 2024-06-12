import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const equipmentcomp = () => {

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

  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
<h2 class='text-lg font-bold'>Equipments</h2>

      <div class="relative overflow-x-auto ">
      <table className="w-full text-sm text-left rtl:text-right text-black dark:text-gray-400">
  <thead>
    <tr>
      <th className="py-3">Name</th>
      <th className="py-3">Quantity</th>
    </tr>
  </thead>
  <tbody>
    {
      equipment.slice(0, 4).map((m, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td>{m.equipmentName}</td>
          <td className="text-center">{m.quantity}</td>
        </tr>
      ))
    }
  </tbody>
</table>

      <div class='mt-4'>
      <Link
        to="/dashboard/equipment"
        class=""
      >
       see more
      </Link></div>
      </div>
    </div>
  );
};

export default equipmentcomp;
