import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        axios.get('http://localhost:3000/auth/adminprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.Status) {
                setAdmin(response.data.admin);
            } else {
                setError(response.data.Error);
            }
        })
        .catch(err => setError('An error occurred while fetching the profile data.'));
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(response => {
                if (response.data.Status) {
                    localStorage.removeItem('token'); // Clear the token from localStorage
                    navigate('/adminlogin');
                }
            })
            .catch(err => console.log(err));
    };




    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    if (!admin) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold">Admin Profile</h1>
                <p><strong>Name:</strong> {admin.name}</p>
                <p><strong>Username:</strong> {admin.username}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Contact Number:</strong> {admin.contact}</p>

 
            </div>

            <div className='space-y-4 space-x-6 '>
            <Link
                    to={'/Dashboard/add_admin'}
                    className="bg-white max text-black font-medium rounded-lg px-4 py-2 hover:bg-neutral-300"
                >
                    New Admin
                </Link>

                <Link
                    to={'/Dashboard/change_adminpassword'}
                    className="bg-white text-black font-medium rounded-lg px-4 py-2  hover:bg-neutral-300"
                >
                    Change Password
                </Link>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

           
        </div>
    );
};

export default Profile;
