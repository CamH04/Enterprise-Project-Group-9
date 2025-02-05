import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="nhsuk-navbar nhsuk-navbar--default nhsuk-navbar--sticky">
      <div className="nhsuk-navbar__menu">
        <Link to="/" className="nhsuk-navbar__link">NHS Calm App</Link>

        <div className="nhsuk-navbar__dropdown">
          <button onClick={toggleProfileDropdown} className="nhsuk-navbar__link nhsuk-navbar__link--dropdown">
            Profile
          </button>

          {isProfileDropdownOpen && (
            <div className="nhsuk-navbar__dropdown-menu">
            <Link to="/profile" className="nhsuk-navbar__dropdown-item">Profile</Link>
              <Link to="/login" className="nhsuk-navbar__dropdown-item">Login</Link>
              <Link to="/register" className="nhsuk-navbar__dropdown-item">Register</Link>
              <Link to="/logout" className="nhsuk-navbar__dropdown-item">Logout</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
