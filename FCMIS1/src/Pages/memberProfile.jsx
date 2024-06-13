import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import HeroPages from "../components/hero-pages/HeroPages";

const Profile = () => {
    const [member, setMember] = useState(null);
    const [error, setError] = useState(null);
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
      <div className="bg-gray-100 min-h-screen">
        <HeroPages page="Profile" />
      
        <div className="container mx-auto px-4 py-10 mt-10">
            <div className="max-w-lg mx-auto bg-neutral-800 shadow-md rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-10 justify-center mt-6 mb-6">
                    <img src={`http://localhost:3000/images/${member.image}`} alt="Profile" className="bg-black w-24 h-24 md:w-40 md:h-40 rounded-full mb-4 md:mb-0" />
                    <img src={member.qrCode} alt="QR Code" className="bg-black w-24 h-24 md:w-40 md:h-40 rounded-lg mb-4 md:mb-0" />
                </div>
                <div className="text-white space-y-4 mt-4 mb-6 md:mt-0 md:ml-4">
                    <p><strong>Name:</strong> {member.name}</p>
                    <p><strong>Username:</strong> {member.username}</p>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Contact:</strong> {member.contact}</p>
                    <p><strong>Registered Date:</strong> {formatDate(member.registerDate)}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 mt-6 space-y-4 md:space-y-0 justify-center">
                <Link
                    to={'/member/editprofile'}
                    className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-500 text-center"
                >
                    Edit Details
                </Link>

                <Link
                    to={'/member/changepassword'}
                    className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-500 text-center"
                >
                    Change Password
                </Link>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-red-700 text-center"
                >
                    Logout
                </button>
            </div>
        </div>
      </div>
    );
};

export default Profile;
