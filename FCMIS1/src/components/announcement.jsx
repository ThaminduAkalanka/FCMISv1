import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const announcement = () => {

    const [announcement, setAnnouncement] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/announcement')
      .then(result =>{
        if (result.data.Status){
          setAnnouncement(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    },[])


    const handleDelete = (AnnounceID) =>{
      axios.delete('http://localhost:3000/auth/delete_announce/'+AnnounceID)
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
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Announcement</h3>
      </div>
      <Link to="/dashboard/add_announcement" class='flex-1 w-48 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Add Announcement</Link> 

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Announcement ID</th>
            <th class="py-3">Announcement</th>
            <th class="py-3">Announce Date</th>
            <th class="py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            announcement.map((p, index) => (
              <tr key={index}>
                <td>{p.AnnounceID}</td>
                <td>{p.AnnounceDescription}</td>
                <td>{formatDate(p.AnnounceDate)}</td>
                <td>
                  <Link to= {"/dashboard/edit_announce/"+p.AnnounceID} class="flex-1 w-10 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 ">
                    Edit</Link>
                  <button class="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2 "
                  onClick={() => handleDelete(p.AnnounceID)}>
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

export default announcement
