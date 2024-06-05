import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrainersComponent from './trainerComp.jsx';


const Dashboard = () => {
    const [data, setData] = useState({
        totalMembers: 0,
        activeMembers: 0,
        trainers: 0,
        equipments: 0,
        presentMembers: 0,
        earnings: 0,
    });

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:3000/dashboard-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="p-6 bg-gray text-gray-900 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Welcome, <span className="text-blue-600">Admin</span></h2>
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                <TrainersComponent />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* MembersComponent */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* ActiveMembersComponent */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* EquipmentComponent */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
