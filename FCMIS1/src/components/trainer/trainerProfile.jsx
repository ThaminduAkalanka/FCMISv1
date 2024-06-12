import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState(null);
  const [changePasswordValues, setChangePasswordValues] = useState({ currentPassword: '', newPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    axios.get('http://localhost:3000/train/trainerprofile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.Status) {
          setTrainer(response.data.trainer);
        } else {
          setError(response.data.Error);
        }
      })
      .catch(err => setError('An error occurred while fetching data.'));
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

  if (!trainer) {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Trainer Profile</h1>

      <div className="max-w-lg mx-auto bg-neutral-600 shadow-md rounded-lg p-6 space-y-6 mt-10">
        <div className="flex justify-center">
          <img src={`http://localhost:3000/images/${trainer.image}`} className="bg-black w-40 h-auto rounded-full" alt="Trainer" />
        </div>
        <p><strong>Name:</strong> {trainer.name}</p>
        <p><strong>Username:</strong> {trainer.username}</p>
        <p><strong>Contact:</strong> {trainer.contact}</p>
        <p><strong>Registered Date:</strong> {formatDate(trainer.registerDate)}</p>
      </div>

      <div className="flex space-x-6 mt-6 justify-center">
        <Link
          to={'/trainer/editprofile'}
          className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-500"
        >
          Edit Details
        </Link>

        <Link
          to={'/trainer/changepassword'}
          className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-500"
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
