import React, { useState } from 'react';
import axios from 'axios';
import './wrap.css';


const WRAPForm = () => {
  const [wellnessTools, setWellnessTools] = useState('');
  const [triggers, setTriggers] = useState('');
  const [earlyWarningSigns, setEarlyWarningSigns] = useState('');
  const [whenThingsBreakDown, setWhenThingsBreakDown] = useState('');
  const [crisisPlan, setCrisisPlan] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSaveWRAP = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to save your WRAP.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/saveWRAP',
        {
          wellnessTools,
          triggers,
          earlyWarningSigns,
          whenThingsBreakDown,
          crisisPlan
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('WRAP saved successfully!');
    } catch (err) {
      setError('Failed to save WRAP data.');
    }
  };

  return (
    <div className="nhsuk-container">
      <h2>Wellness Recovery Action Plan (WRAP)</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSaveWRAP}>
        <div>
          <label htmlFor="wellnessTools">Wellness Tools:</label>
          <textarea
            id="wellnessTools"
            placeholder="Describe the tools you use to stay well (e.g., exercise, meditation, talking to a friend)"
            value={wellnessTools}
            onChange={(e) => setWellnessTools(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>

        <div>
          <label htmlFor="triggers">Stressors:</label>
          <textarea
            id="triggers"
            placeholder="List the things that may trigger you (e.g., certain situations, events, people)"
            value={triggers}
            onChange={(e) => setTriggers(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>

        <div>
          <label htmlFor="earlyWarningSigns">Early Warning Signs:</label>
          <textarea
            id="earlyWarningSigns"
            placeholder="Describe the signs that indicate you're starting to feel unwell (e.g., irritability, trouble sleeping)"
            value={earlyWarningSigns}
            onChange={(e) => setEarlyWarningSigns(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>

        <div>
          <label htmlFor="whenThingsBreakDown">When Things Are Breaking Down:</label>
          <textarea
            id="whenThingsBreakDown"
            placeholder="What to do when things feel like they're breaking down (e.g., ask for help, take a break)"
            value={whenThingsBreakDown}
            onChange={(e) => setWhenThingsBreakDown(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>

        <div>
          <label htmlFor="crisisPlan">Wellness Plan:</label>
          <textarea
            id="crisisPlan"
            placeholder="What to do in a crisis situation (e.g., call a support person, go to a safe space)"
            value={crisisPlan}
            onChange={(e) => setCrisisPlan(e.target.value)}
            className="nhsuk-input"
            required
          />
        </div>

        <button type="submit" className="nhsuk-button">Save WRAP</button>
      </form>
    </div>
  );
};

export default WRAPForm;
