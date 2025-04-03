import React from 'react';
import "./Home.css";
import Logo from './static/logo_img.png';
import Button from './Button'

const handleClickLogin = () => {
  window.location.href = "/login";
}
const handleClickRegister = () => {
  window.location.href = "/register";
}

const Home = () => {
  return (
      <div className="container-big">
        <div className="nhsuk-container container">
          <div className="header">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <h1 className="title">Welcome to your space for wellness and peace.</h1>
          <div className="buttons">
            <Button onClick={handleClickLogin}>Log In</Button>
            <Button onClick={handleClickRegister}>Create Account</Button>
          </div>
        </div>
      </div>
  );
}

export default Home;
