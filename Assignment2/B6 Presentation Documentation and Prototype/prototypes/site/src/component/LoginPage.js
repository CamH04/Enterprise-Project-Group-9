import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './button.css';
import './login.css';
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
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Speak or type here..."
      />
      <button onClick={startStopListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Login Response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed: Invalid username or password');
    }
  };

  return (
    <div className="nhsuk-container nhsuk-form-group">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label className="nhsuk-label" htmlFor="username">Username</label>
        <VoiceInput setInputValue={setUsername} />
        
        <label className="nhsuk-label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="nhsuk-button nhsuk-button--secondary">Login</button>
      </form>

      <button
        className="nhsuk-button nhsuk-button--link"
        onClick={() => navigate('/reset-password')}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#005eb8', cursor: 'pointer' }}
      >
        Forgot password? Reset it
      </button>
    </div>
  );
};

export default Login;