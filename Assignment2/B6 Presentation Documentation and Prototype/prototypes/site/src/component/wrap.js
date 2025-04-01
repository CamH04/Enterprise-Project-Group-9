import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wrap.css';
import './VoiceActivation.css'
import VoiceActivation from './VoiceActivation';

const VoiceInput = ({ setInputValue }) => {
    const [textInput, setTextInput] = useState('');
    const { isListening, transcript, startListening, stopListening } = VoiceActivation({ continuous: true });

    useEffect(() => {
        setTextInput(transcript);
        setInputValue(transcript);
    }, [transcript, setInputValue]);

    const startStopListening = () => {
        isListening ? stopListening() : startListening();
    };

    return (
        <div>
            <input
                type="text"
                value={textInput}
                onChange={(e) => {
                    setTextInput(e.target.value);
                    setInputValue(e.target.value);
                }}

                placeholder="Speak or type here..."
            />
            <button className="vtt-button" onClick={startStopListening}>
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
        </div>
    );
};

const WRAPForm = () => {
  const [wellnessTools, setWellnessTools] = useState('');
  const [triggers, setTriggers] = useState('');
  const [earlyWarningSigns, setEarlyWarningSigns] = useState('');
  const [whenThingsBreakDown, setWhenThingsBreakDown] = useState('');
  const [crisisPlan, setCrisisPlan] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasExistingWRAP, setHasExistingWRAP] = useState(false);

  useEffect(() => {
    fetchWRAPData();
  }, []);

  const fetchWRAPData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await axios.get('http://localhost:5000/userWRAP', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.wrapData) {
        const { wellness_tools, triggers, early_warning_signs, when_things_break_down, crisis_plan } = response.data.wrapData;
        setWellnessTools(wellness_tools);
        setTriggers(triggers);
        setEarlyWarningSigns(early_warning_signs);
        setWhenThingsBreakDown(when_things_break_down);
        setCrisisPlan(crisis_plan);
        setHasExistingWRAP(true);
      }
    } catch (err) {
      console.log('No existing WRAP found.');
    }
  };

  const handleSaveWRAP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to save your WRAP.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/saveWRAP',
        { wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('WRAP saved successfully!');
      setHasExistingWRAP(true);
    } catch (err) {
      setError('Failed to save WRAP data.');
    }
  };

  const handleUpdateWRAP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to update your WRAP.');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/updateWRAP',
        { wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('WRAP updated successfully!');
    } catch (err) {
      setError('Failed to update WRAP data.');
    }
  };

  return (
    <div className="nhsuk-container">
      <h2>Wellness Recovery Action Plan (WRAP)</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form>
        <div>
          <label htmlFor="wellnessTools">Wellness Tools:</label>
          <VoiceInput setInputValue={setWellnessTools} />

        </div>

        <div>
          <label htmlFor="triggers">Stressors:</label>
          <VoiceInput setInputValue={setTriggers} />

        </div>

        <div>
          <label htmlFor="earlyWarningSigns">Early Warning Signs:</label>
          <VoiceInput setInputValue={setEarlyWarningSigns} />

        </div>

        <div>
          <label htmlFor="whenThingsBreakDown">When Things Are Breaking Down:</label>
          <VoiceInput setInputValue={setWhenThingsBreakDown} />

        </div>

        <div>
          <label htmlFor="crisisPlan">Wellness Plan:</label>
          <VoiceInput setInputValue={setCrisisPlan} />

        </div>

        <button type="submit" onClick={handleSaveWRAP} className="nhsuk-button">
          Save WRAP
        </button>

        {hasExistingWRAP && (
          <button type="button" onClick={handleUpdateWRAP} className="nhsuk-button nhsuk-button--secondary">
            Update WRAP
          </button>
        )}
      </form>
    </div>
  );
};

export default WRAPForm;
