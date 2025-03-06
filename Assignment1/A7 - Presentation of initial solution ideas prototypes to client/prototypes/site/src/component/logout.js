import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="nhsuk-container">
      <button className="nhsuk-button nhsapp-button nhsapp-button--secondary"  data-module="nhsuk-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Logout;
