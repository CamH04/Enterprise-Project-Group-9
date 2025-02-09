import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './button.css';

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
      <label class="nhsuk-label" for="example">
    Username
  </label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label class="nhsuk-label" for="example">
  Password
  </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="nhsuk-button nhsuk-button--secondary" data-module="nhsuk-button" >Login</button>

      </form>
    </div>
  );
};

export default Login;
