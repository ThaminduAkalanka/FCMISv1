import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TrainersComponent from '../trainerComp.jsx';
import EquipmentComponent from '../equipmentcomp.jsx';
import ActiveMembersComponent from '../activeMembercomp.jsx';
import GenderDistributionChart from '../chartGender.jsx';
import CategoryDistributionChart from '../chartCategory.jsx'; // Import the new component

const trainerHome = () => {
    const [data, setData] = useState({
        totalMembers: null,
        activeMembers: null,
        trainers: null,
        equipments: null,
        presentMembers: null,
        earnings: null,
    });
    const [trainername, settrainername] = useState(null);

    useEffect(() => {

      const token = localStorage.getItem('token');
      if (!token) {
          setError('No token found, please log in.');
          return;
      }
        // Fetch dashboard data from the backend
        axios.get('http://localhost:3000/auth/dashboard-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });

            axios.get('http://localhost:3000/train/trainerprofile', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
          .then(response => {
              if (response.data.Status) {
                  settrainername(response.data.trainer.username);
              } else {
                  setError(response.data.Error);
              }
          })
          .catch(err => setError('An error occurred while fetching data.'));
    }, []);

    return (
        <div className="p-6 bg-gray text-gray-900 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Welcome, <span className="text-blue-600">{trainername}</span></h2>
                <p className="mt-2 text-gray-600">As an trainer, you hold the key to assign schedules, track progress, manage schedules, manage categories and ensure a seamless fitness experience. Your dedication ensures the success of our fitness community. Thank you for being an essential part of our journey!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Total Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.totalMembers}</p>
                </div>
  
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Active Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.activeMembers}</p>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md text-center self-start">
                    <h3 className="text-xl font-semibold">Total Equipments</h3>
                    <p className="mt-2 text-3xl font-bold">{data.equipments}</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center self-start">
                    <h3 className="text-xl font-semibold">Present Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.presentMembers}</p>
                </div>
                

                <div className="bg-white p-6 rounded-lg shadow-md text-center self-start">
                    <GenderDistributionChart />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center self-start">
                    <CategoryDistributionChart />
                </div>

           
            
 
                <div className="bg-white p-6 rounded-lg shadow-md self-start">
                    <EquipmentComponent/>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md ">
                    <ActiveMembersComponent />
                </div>
            </div>
        </div>
    );
}

export default trainerHome;
