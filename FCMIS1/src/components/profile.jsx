import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const profile = () => {
  const [admin, setAdmin] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/admin')
      .then(result => {
        if (result.data.Status) {
          setAdmin(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    axios.post('http://localhost:3000/auth/change_password', { newPassword })
      .then(result => {
        if (result.data.Status) {
          alert('Password updated successfully');
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleRegisterMember = () => {
    navigate('/dashboard/add_member');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Contact:</strong> {admin.contact}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handlePasswordChange} className="bg-blue-500 text-white p-2 rounded">
          Change Password
        </button>
      </div>
      <div>
        <button onClick={handleRegisterMember} className="bg-green-500 text-white p-2 rounded">
          Register New Member
        </button>
      </div>
    </div>
  );
};

export default profile;
