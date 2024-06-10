import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const manageSchedule = () => {

    const [schedule, setSchedule] = useState([])
    const [category, setCategory] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/train/manageschedule')
      .then(result =>{
        if (result.data.Status){
          setSchedule(result.data.Result);
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
    },[])


    const handleDelete = (scheduleID) =>{
      axios.delete('http://localhost:3000/train/delete_schedule/'+scheduleID)
      .then(result =>{
        if (result.data.Status){
          window.location.reload()
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    }

    const getcatName = (categoryID) => {
      const mem = category.find(s => s.categoryID === categoryID)
      return mem ? mem.categoryName : 'Unknown'
    }
  return (
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Schedules</h3>
      </div>
      <Link to="/trainerDashboard/add_schedule" class='flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Add Schedule</Link> 

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Schedule ID</th>
            <th class="py-3">Workout Category</th>
            <th class="py-3">Name</th>
            <th class="py-3">Level</th>
            <th class="py-3">Details</th>
            <th class="py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            schedule.map((p, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td>{p.scheduleID}</td>
                <td>{getcatName(p.categoryID)}</td>
                <td>{p.name}</td>
                <td>{p.level}</td>
                <td>{p.scheduleDetail}</td>
                <td>
                  <Link to= {"/trainerDashboard/edit_schedule/"+p.scheduleID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Edit</Link>
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(p.scheduleID)}>
                    Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
    
    
    </div>
  )
}

export default manageSchedule
