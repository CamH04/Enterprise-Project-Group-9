import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/profile', { headers: { Authorization: token } })
      .then((response) => {
        setProfile(response.data.user);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="nhsuk-container">
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
    </div>
  );
};

export default Profile;
