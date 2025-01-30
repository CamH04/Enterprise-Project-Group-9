import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nhsuk-navbar nhsuk-navbar--default nhsuk-navbar--sticky">
      <div className="nhsuk-navbar__menu">
        <Link to="/" className="nhsuk-navbar__link">NHS Calm App</Link>
        <Link to="/login" className="nhsuk-navbar__link">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
