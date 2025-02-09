import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfileAndMoods = async () => {
      try {
        if (!token) throw new Error('No token found in local storage');

        const profileResponse = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.status === 200) {
          setProfile(profileResponse.data.user);
        } else {
          throw new Error('Failed to fetch profile');
        }

        const moodsResponse = await axios.get('http://localhost:5000/userMoods', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (moodsResponse.status === 200) {
          setMoods(moodsResponse.data.moods);
        } else {
          throw new Error('Failed to fetch mood data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.error || error.message || 'An error occurred');
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndMoods();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data found.</div>;
  if (moods.length === 0) return <div>No mood submissions found.</div>;

  return (
    <div className="nhsuk-container">
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
      <h3>Your Mood Submissions:</h3>
      {moods.map((mood, index) => (
        <div key={index} className="mood-submission">
          <p><strong>Mood:</strong> {mood.mood}</p>
          <p><strong>Keywords:</strong> {mood.keywords}</p>
          <p><strong>Notes:</strong> {mood.notes}</p>
          <p><strong>Visible to GPs:</strong> {mood.visible_to_gps ? 'Yes' : 'No'}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Profile;
