import React, { useState } from 'react';
import axios from 'axios';

const MoodTracker = () => {
  const [mood, setMood] = useState('Neutral'); // Default to Neutral
  const [keywords, setKeywords] = useState('');
  const [notes, setNotes] = useState('');
  const [visibleToGps, setVisibleToGps] = useState(false); // Default is false
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMoodChange = (e) => {
    const value = e.target.value;
    if (value === '0') setMood('Depressed');
    if (value === '1') setMood('Sad');
    if (value === '2') setMood('Angry');
    if (value === '3') setMood('Neutral');
    if (value === '4') setMood('Happy');
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to save your mood.');
        return;
      }

      const response = await axios.post('http://localhost:5000/saveMood',
        { mood, keywords, notes, visible_to_gps: visibleToGps },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Mood saved successfully!');
    } catch (err) {
      setError('Failed to save mood data.');
    }
  };

  return (
    <div className="nhsuk-container">
      <h2>Track Your Mood</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSaveMood}>
        <div>
          <label htmlFor="moodSlider">Select Your Mood: </label>
          <input
            id="moodSlider"
            type="range"
            min="0"
            max="4"
            step="1"
            onChange={handleMoodChange}
            className="nhsuk-range"
          />
          <span>{mood}</span>
        </div>
        <div>
          <label htmlFor="keywords">Keywords: </label>
          <input
            id="keywords"
            type="text"
            placeholder="Enter keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>
        <div>
          <label htmlFor="notes">Notes: </label>
          <textarea
            id="notes"
            placeholder="Add your notes here"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="nhsuk-textarea"
            required
          />
        </div>
        <div>
          <label htmlFor="visibleToGps">
            <input
              id="visibleToGps"
              type="checkbox"
              checked={visibleToGps}
              onChange={(e) => setVisibleToGps(e.target.checked)}
            />
            Share this information to your GP
          </label>
        </div>
        <button type="submit" className="nhsuk-button">Save Mood</button>
      </form>
    </div>
  );
};

export default MoodTracker;
