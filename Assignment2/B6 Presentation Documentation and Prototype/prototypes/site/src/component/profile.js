import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecommendedArticles from './RecommendedArticles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [moods, setMoods] = useState([]);
  const [wrap, setWrap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfileAndMoodsAndWrap = async () => {
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
        const wrapResponse = await axios.get('http://localhost:5000/userWRAP', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (wrapResponse.status === 200) {
          setWrap(wrapResponse.data.wrapData);
        } else {
          throw new Error('Failed to fetch WRAP data');
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

    fetchProfileAndMoodsAndWrap();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data found.</div>;
  if (moods.length === 0) return <div>No mood submissions found.</div>;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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
          <p><strong>Submitted on:</strong> {formatDate(mood.timestamp)}</p>
          <hr />
        </div>
      ))}

      {wrap ? (
        <div>
          <h3>Your Wellness Recovery Action Plan (WRAP):</h3>
          <div>
            <p><strong>Wellness Tools:</strong> {wrap.wellness_tools}</p>
            <p><strong>Triggers:</strong> {wrap.triggers}</p>
            <p><strong>Early Warning Signs:</strong> {wrap.early_warning_signs}</p>
            <p><strong>When Things Break Down:</strong> {wrap.when_things_break_down}</p>
            <p><strong>Crisis Plan:</strong> {wrap.crisis_plan}</p>
            <p><strong>Last Updated on:</strong> {formatDate(wrap.timestamp)}</p>
            <hr />
          </div>
        </div>
      ) : (
        <div>No WRAP data available.</div>
      )}
    </div>
  );
};

export default Profile;
