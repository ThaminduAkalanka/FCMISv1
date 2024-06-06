import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [changePasswordValues, setChangePasswordValues] = useState({ currentPassword: '', newPassword: '' });
    const [registerValues, setRegisterValues] = useState({ name:'', username: '', password: '', email: '', contact: '' });
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

    const handleRegister = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/auth/registeradmin', registerValues, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.Status) {
                alert('New admin registered successfully.');
                setRegisterValues({ name:'', username: '',  password: '', email: '', contact: '' });
            } else {
                alert(response.data.Error);
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
            <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded p-6 space-y-6">
                <h1 className="text-2xl font-bold">Admin Profile</h1>
                <p><strong>Username:</strong> {admin.username}</p>
                <p><strong>Email:</strong> {admin.email}</p>
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

            <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded p-6 space-y-6 mt-8">
                <h2 className="text-xl font-bold">Register New Admin</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block font-medium" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="username"
                            value={registerValues.name}
                            onChange={(e) => setRegisterValues({ ...registerValues, name: e.target.value })}
                            className="block w-full mt-1 border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block font-medium" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={registerValues.username}
                            onChange={(e) => setRegisterValues({ ...registerValues, username: e.target.value })}
                            className="block w-full mt-1 border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block font-medium" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={registerValues.password}
                            onChange={(e) => setRegisterValues({ ...registerValues, password: e.target.value })}
                            className="block w-full mt-1 border border-gray-300 text-black rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block font-medium" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={registerValues.email}
                            onChange={(e) => setRegisterValues({ ...registerValues, email: e.target.value })}
                            className="block w-full mt-1 border border-gray-300 text-black rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block font-medium" htmlFor="contact">Contact</label>
                        <input
                            type="tel"
                            id="contact"
                            value={registerValues.contact}
                            onChange={(e) => setRegisterValues({ ...registerValues, contact: e.target.value })}
                            className="block w-full mt-1 border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
