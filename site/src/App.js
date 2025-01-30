import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar.js';
import LoginPage from './component/LoginPage.js';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="nhsuk-container">
        <Routes>
          <Route path="/"/>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
