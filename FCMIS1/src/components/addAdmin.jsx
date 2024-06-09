import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const addAdmin = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
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

  return (
    
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
  )
}

export default addAdmin