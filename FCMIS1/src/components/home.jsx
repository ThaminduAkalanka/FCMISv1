import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrainersComponent from './trainerComp.jsx';
import EquipmentComponent from './equipmentcomp.jsx';
import ActiveMembersComponent from './activeMembercomp.jsx'

const Dashboard = () => {
    const [data, setData] = useState({
        totalMembers: 10,
        activeMembers: 6,
        trainers: 2,
        equipments: 25,
        presentMembers: 2,
        earnings: 25000,
    });
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        // Fetch dashboard data from the backend
        axios.get('http://localhost:3000/dashboard-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });

        // Fetch admin details from the backend
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/auth/adminprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.Status) {
                setAdminName(response.data.admin.name);
            } else {
                console.error('Failed to fetch admin details');
            }
        })
        .catch(error => {
            console.error('There was an error fetching the admin details!', error);
        });
    }, []);

    return (
        <div className="p-6 bg-gray text-gray-900 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Welcome, <span className="text-blue-600">{adminName}</span></h2>
                <p className="mt-2 text-gray-600">As an admin, you hold the key to streamline memberships, track progress, manage payments, and ensure a seamless fitness experience. Your dedication ensures the success of our fitness community. Thank you for being an essential part of our journey!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Total Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.totalMembers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Total Earnings</h3>
                    <p className="mt-2 text-3xl font-bold">{data.earnings} LKR</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Active Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.activeMembers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Trainers</h3>
                    <p className="mt-2 text-3xl font-bold">{data.trainers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Equipments</h3>
                    <p className="mt-2 text-3xl font-bold">{data.equipments}</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold">Present Members</h3>
                    <p className="mt-2 text-3xl font-bold">{data.presentMembers}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md h-72">
                    <TrainersComponent />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-72">
                    <EquipmentComponent/>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md ">
                    <ActiveMembersComponent />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
