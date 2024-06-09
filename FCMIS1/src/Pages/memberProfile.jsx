import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
            <div className="felx max-w-lg mx-auto bg-neutral-600 shadow-md rounded-lg p-6 space-y-6">
                <div className='flex justify-center space-x-10'>
                <img src ={ `http://localhost:3000/images/`+member.image} class='bg-black w-40 h-auto rounded-full'/>
                <img src ={member.qrCode} class='bg-black w-40 h-auto rounded-lg'/></div>
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Username:</strong> {member.username}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Contact:</strong> {member.contact}</p>
                <p><strong>Registered Date:</strong> {formatDate(member.registerDate)}</p>
            </div>


            <div className='space-y-4 space-x-6 '>
            <Link
                    to={'/member/editprofile'}
                    className="bg-white max text-black font-medium rounded-lg px-4 py-2 hover:bg-neutral-300"
                >
                    Edit Details
                </Link>

                <Link
                    to={'/member/changepassword'}
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
        </div>
    );
};

export default Profile;

