import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const payments = () => {

    const [payment, setPayemnt] = useState([])
    const [member, setMember] = useState([])
    const [Package, setPackages] = useState([])
  

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/paymentdisplay')
      .then(result =>{
        if (result.data.Status){
          setPayemnt(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    },[]) 


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


    const getPackageName = (packageID) => {
      const pkg = Package.find(p => p.packageID === packageID)
      return pkg ? pkg.packageName : 'Unknown'
    }
  
    const getName = (memberID) => {
      const mem = member.find(s => s.memberID === memberID)
      return mem ? mem.name : 'Unknown'
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
        <h3>Payments</h3>
      </div>
      
      <div class="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4 ">
      <table class="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th class="py-3">Payment ID</th>
            <th class="py-3">Date</th>
            <th class="py-3">Member</th>
            <th class="py-3">Package</th>
            <th class="py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            payment.map((p, index) => (
              <tr key={index}>
                <td class="py-2">{p.paymentID}</td>
                <td class="py-2">{formatDate(p.paymentDate)}</td>
                <td>{getName(p.memberID)}</td>
                <td>{getPackageName(p.packageID)}</td>
                <td>{p.amount}</td>
                </tr>
            ))
          }
        </tbody>
      </table>
      </div>
    
    
    </div>
  )
}

export default payments;
