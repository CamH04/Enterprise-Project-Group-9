import React from 'react';
import "./Home.css";
import Logo from './static/logo_img.png';

const Home = () => {
  return (
      <div className="container-big">
        <div className="nhsuk-container container">
          <div className="header">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <h1 className="title">Welcome to your space for wellness and peace.</h1>
          <div className="buttons">
            <button className="nhsuk-button">Log In</button>
            <button className="nhsuk-button">Create Account</button>
          </div>
        </div>
      </div>
  );
}

export default Home;
