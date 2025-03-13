import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './button.css';
import './login.css';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/reset-password', { username, password });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password');
      setMessage('');
    }
  };

  return (
    <div className="nhsuk-container nhsuk-form-group">
      <h2>Reset Password</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleResetRequest}>
        <label className="nhsuk-label" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="nhsuk-label" htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="nhsuk-button nhsuk-button--secondary">Reset Password</button>
      </form>

      <button
        className="nhsuk-button nhsuk-button--link"
        onClick={() => navigate('/login')}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#005eb8', cursor: 'pointer' }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default ResetPassword;
