import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeroPages from "../components/hero-pages/HeroPages";

const Profile = () => {
    const [member, setMember] = useState(null);
    const [error, setError] = useState(null);
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

    const handleLogout = () => {
        axios.get('http://localhost:3000/mem/logout')
            .then(response => {
                if (response.data.Status) {
                    localStorage.removeItem('token'); // Clear the token from localStorage
                    navigate('/memberlogin');
                }
            })
            .catch(err => console.log(err));
    };

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

    return (
      <div>
        <HeroPages page="Profile" />
      
        <div className="container mx-auto p-10 mt-10 sd:p-4  ">
            <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded p-6 space-y-6">
                
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Username:</strong> {member.username}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Contact:</strong> {member.contact}</p>
                <p><strong>Registered Date:</strong> {formatDate(member.registerDate)}</p>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded p-6 space-y-6 mt-8">
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
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700"
                    >
                        Change Password
                    </button>
                </form>
            </div>

            </div>
        </div>
    );
};

export default Profile;

