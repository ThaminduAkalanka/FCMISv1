import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          setError('No token found, please log in.');
          return;
      }
  
      axios.get('http://localhost:3000/auth/adminprofile', {
          headers: {
              'Authorization': `Bearer ${token}` // Add "Bearer " prefix
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
  

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!admin) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Profile</h1>
            <p>Username: {admin.username}</p>
            <p>Email: {admin.email}</p>
            {/* Add other fields as necessary */}
        </div>
    );
};

export default Profile;
