import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeroPages from "../components/hero-pages/HeroPages";
import PricingCards from "../components/pricing/PricingCards";

function memberPackage() {
    const [member, setMember] = useState(null);
    const [error, setError] = useState(null);
    const [Package, setPackages] = useState([])
    const [changePasswordValues, setChangePasswordValues] = useState({ currentPassword: '', newPassword: '' });
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          setError('No token found, please log in.');
          return;
      }

      axios.get('http://localhost:3000/mem/memberpackage', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => {
          if (response.data.Status) {
              setMember(response.data.member);
          } else {
              setError(response.data.Error);
          }
      })
      .catch(err => setError('An error occurred while fetching the profile data.'));

      axios.get('http://localhost:3000/auth/package')
      .then(result =>{
        if (result.data.Status){
          setPackages(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
}

if (!member) {
    return <div className="text-center mt-4">Loading...</div>;
}

const formatDate = (dateString) => {
  if (!dateString) {
    return '-';
  }
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-CA', options);
};

const getPackageName = (packageID) => {
  const pkg = Package.find(p => p.packageID === packageID)
  return pkg ? pkg.packageName : 'Unknown'
}

  return (
    <main className="bg-gray-100 min-h-screen ">
      <HeroPages page="Package" />
      <h1 className="text-2xl font-bold text-neutral-800 mt-16 mb-4">Current Package</h1>
      <div className="max-w-xl mx-auto mt-6">
        <div className="bg-neutral-600 shadow-lg rounded-lg p-6"> 
          <div className="space-y-4">
            <p className="text-lg"><span className="font-semibold">Package:</span> {getPackageName(member.packageID)}</p>
            
            <div className="flex justify-center text-lg space-x-2">
              <span className="font-semibold">Status:</span>
              <div style={{ color: member.status === 'active' ? 'lime' : m.status === 'pending' ? 'yellow' : 'red' }}>
                {member.status}
              </div>
            </div>
            
            <p className="text-lg"><span className="font-semibold">Start Date:</span> {formatDate(member.startDate)}</p>
            <p className="text-lg"><span className="font-semibold">Expire Date:</span> {formatDate(member.endDate)}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">


        <PricingCards />
      </div>
    </main>
  );
}

export default memberPackage;
