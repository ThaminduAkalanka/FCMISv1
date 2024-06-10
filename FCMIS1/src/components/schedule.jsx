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

    
  const getName = (categoryID) => {
    const mem = category.find(s => s.categoryID === categoryID)
    return mem ? mem.categoryName : 'Unknown'
  }

  return (
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Schedules</h3>
      </div>
    
      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Schedule ID</th>
            <th class="py-3">Workout Category</th>
            <th class="py-3">Name</th>
            <th class="py-3">Level</th>
            <th class="py-3">Details</th>
            
          </tr>
        </thead>
        <tbody>
          {
            schedule.map((p, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td>{p.scheduleID}</td>
                <td>{getName(p.categoryID)}</td>
                <td>{p.name}</td>
                <td>{p.level}</td>
                <td>{p.scheduleDetail}</td>
 
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
