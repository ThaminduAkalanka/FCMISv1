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
  
    const handleDelete = (paymentID) =>{
      axios.delete('http://localhost:3000/auth/delete_payment/'+paymentID)
      .then(result =>{
        if (result.data.Status){
          window.location.reload()
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    }
  return (
    <div class='grid grid-flow-row auto-rows-max space-y-4'>
      <div>
        <h3>Payments</h3>
      </div>
      
<div className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-2 pt-6 pb-8 mb-4">
  <table className="w-full text-sm text-center rtl:text-right text-white dark:text-gray-400">
    <thead className="">
      <tr>
        <th className="py-3">Payment ID</th>
        <th className="py-3">Date</th>
        <th className="py-3">Member</th>
        <th className="py-3">Package</th>
        <th className="py-3">Amount</th>
        <th className="py-3">Action</th>
      </tr>
    </thead>
    <tbody>
      {payment.map((p, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="py-2">{p.paymentID}</td>
          <td className="py-2">{formatDate(p.paymentDate)}</td>
          <td>{getName(p.memberID)}</td>
          <td>{getPackageName(p.packageID)}</td>
          <td>{p.amount}</td>
          <td>
            <button className="flex-1 w-12 h-6 focus:outline-none text-black bg-white hover:bg-neutral-400 font-sm rounded-lg text-xs px-1 py-1 me-2 mb-2" onClick={() => handleDelete(p.paymentID)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    
    
    </div>
  )
}

export default payments;
