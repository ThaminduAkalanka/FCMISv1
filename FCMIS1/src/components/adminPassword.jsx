import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const adminPassword = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [changePasswordValues, setChangePasswordValues] = useState({ currentPassword: '', newPassword: '' });
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


    const handleChangePassword = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/auth/changepassword', changePasswordValues, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.Status) {
                alert('Password changed successfully.');
                setChangePasswordValues({ currentPassword: '', newPassword: '' });
            } else {
                alert(response.data.Error);
            }
        })
        .catch(err => console.log(err));
    };

  return (
    <div className="max-w-lg mx-auto bg-neutral-600 text-left shadow-md rounded p-6 space-y-6 mt-8">
    <h2 className="text-xl font-bold">Change Password</h2>
    <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
            <label className="block font-medium" htmlFor="currentPassword">Current Password</label>
            <input
                type="password"
                id="currentPassword"
                value={changePasswordValues.currentPassword}
                onChange={(e) => setChangePasswordValues({ ...changePasswordValues, currentPassword: e.target.value })}
                className="block w-full mt-1 border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>
        <div>
            <label className="block font-medium" htmlFor="newPassword">New Password</label>
            <input
                type="password"
                id="newPassword"
                value={changePasswordValues.newPassword}
                onChange={(e) => setChangePasswordValues({ ...changePasswordValues, newPassword: e.target.value })}
                className="block w-full mt-1 border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>
        <div class='space-x-6 justify-end'>
        <button
            type="submit"
            className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700"
        >
            Change Password
        </button>

        <button type="button" onClick={() => navigate('/dashboard/profile')} className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900">
        Cancel
        </button></div>
    </form>
</div>

  )
}

export default adminPassword