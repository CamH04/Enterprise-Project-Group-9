import React from 'react';
import './footer.css';
import LOGO from './TransparentLogo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy;M-Y Software All rights reserved.</p>
          <img  src={LOGO} height="50" width="100" alt="fireSpot"/>
      </div>
    </footer>
  );
}

export default Footer;
