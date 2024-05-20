import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const packages = () => {

    const [Package, setPackage] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/package')
      .then(result =>{
        if (result.data.Status){
          setPackage(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    },[]) /*there are 3 types of use effect*/

  return (
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Packages</h3>
      </div>
      <Link to="/dashboard/add_package" class='flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Add Package</Link> 

      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-left rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Package Name</th>
            <th class="py-3">Rate</th>
          </tr>
        </thead>
        <tbody>
          {
            Package.map((p, index) => (
              <tr key={index}>
                <td>{p.packageName}</td>
                <td>{p.Rate}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
    </div>
  )
}


export default packages
