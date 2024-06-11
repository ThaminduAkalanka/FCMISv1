import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const membercomp = () => {

  const [member, setMember] = useState([])
  const [membername, setMembername] = useState([])

  useEffect(() =>{
    axios.get('http://localhost:3000/auth/activemember')
    .then(result =>{
      if (result.data.Status){
        setMember(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/auth/member')
    .then(result =>{
      if (result.data.Status){
        setMembername(result.data.Result);
      }else{
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))


  },[])

  const getName = (memberID) => {
    const mem = membername.find(s => s.memberID === memberID)
    return mem ? mem.name : 'Unknown'
  }

  const getImage = (memberID) => {
    const mem = membername.find(s => s.memberID === memberID)
    return mem ? mem.image : 'Unknown'
  }


  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
<h2 class='text-lg font-bold'>Active Member</h2>

      <div class="relative overflow-x-auto ">
      <table class="w-full text-sm text-center rtl:text-right text-black dark:text-gray-400 ">
        <thead class="">
          <tr>
            
            <th ></th>
            <th ></th>
            
          </tr>
        </thead>
        <tbody>
          {
            member.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td class='py-4'><img src ={ `http://localhost:3000/images/`+ getImage(m.memberID)} class='bg-black w-10 h-auto rounded-full'/></td>
                <td>{getName(m.memberID)}</td>
                
              </tr>
            ))
          }
        </tbody>
      </table>
      <div class='mt-4'>
      <Link
        to="/dashboard/member"
        class=""
      >
       see more
      </Link></div>
      </div>
    </div>
  );
};

export default membercomp;
