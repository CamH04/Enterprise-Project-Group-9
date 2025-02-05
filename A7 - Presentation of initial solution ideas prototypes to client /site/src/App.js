import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar.js';
import LoginPage from './component/LoginPage.js';
import Register from './component/register.js';
import Profile from './component/profile.js';
import Footer from './component/footer.js';
import Logout from './component/logout.js';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="nhsuk-container">
        <Routes>
          <Route path="/"/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
