import React, { useState } from 'react';
import axios from 'axios';
import { FaSadTear, FaFrown, FaMeh, FaSmile, FaLaugh } from 'react-icons/fa';
import './mood.css';

const MoodTracker = () => {
  const [mood, setMood] = useState('Neutral');
  const [keywords, setKeywords] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sliderValue, setSliderValue] = useState(2);

  const handleMoodChange = (e) => {
    const value = e.target.value;
    setSliderValue(value);
    const moodMap = {
      0: 'Depressed',
      1: 'Sad',
      2: 'Neutral',
      3: 'Happy',
      4: 'Very Happy'
    };
    setMood(moodMap[value]);
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    const formattedKeywords = keywords
      .split(/[,\s]+/)
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== '')
      .join(',');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to save your mood.');
        return;
      }

      await axios.post('http://localhost:5000/saveMood',
        { mood, keywords: formattedKeywords, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Mood saved successfully!');
    } catch (err) {
      setError('Failed to save mood data.');
    }
  };

  const sliderStyle = {
    appearance: 'none',
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    outline: 'none',
    transition: '0.3s',
    background: 'linear-gradient(to right, #e74c3c 0%, #f39c12 25%, #f1c40f 50%, #2ecc71 75%, #27ae60 100%)',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="nhsuk-container margin-padd">
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
            value={sliderValue}
            onChange={handleMoodChange}
            className="nhsuk-range"
            style={sliderStyle}
          />
          <div className="slider-icons" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FaSadTear size={24} color="#e74c3c" />
            <FaFrown size={24} color="#f39c12" />
            <FaMeh size={24} color="#f1c40f" />
            <FaSmile size={24} color="#2ecc71" />
            <FaLaugh size={24} color="#27ae60" />
          </div>
          <br/>
        </div>
        <div>
          <label htmlFor="keywords">Keywords (separate with commas): </label>
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
         <br/>
        <div>
          <label htmlFor="notes">Notes: </label>
          <textarea
            id="notes"
            placeholder="Add your notes here"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>
        <button type="submit" className="nhsuk-button">Save Mood</button>
      </form>
    </div>
  );
};

export default MoodTracker;
