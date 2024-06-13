import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HeroPages from "../../components/hero-pages/HeroPages";

const changePassword = () => {
    const [changePasswordValues, setChangePasswordValues] = useState({ currentPassword: '', newPassword: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        axios.get('http://localhost:3000/mem/memberprofile', {
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
    }, []);

    const handleChangePassword = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/mem/changepassword', changePasswordValues, {
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
    <main>
        <HeroPages page="change Password" />

    <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded p-10 space-y-6 mt-8">
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
        <div className='space-y-4 space-x-6'>
        <button
            type="submit"
            className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700"
        >
            Change Password
        </button>
   </div>
    </form>
</div>
</main>
  )
}

export default changePassword