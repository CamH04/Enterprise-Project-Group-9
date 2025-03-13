import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar.js';
import LoginPage from './component/LoginPage.js';
import Register from './component/register.js';
import Profile from './component/profile.js';
import Footer from './component/footer.js';
import Logout from './component/logout.js';
import MoodTracker from './component/mood.js';
import Game from './component/game.js';
import RecommendedArticles from './component/RecommendedArticles.js';
import WRAPForm from './component/wrap.js';
import ResetPassword from './component/ResetPassword.js'


function App() {
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      });
    }
    const sendNotification = () => {
      if (Notification.permission === 'granted') {
        new Notification('Daily Reminder', {
          body: 'Dont forget to pet your freind and make another step in your mental health journey!'
        });
      }
    };
    const scheduleDailyNotification = () => {
      const now = new Date();
      const todayKey = 'lastNotificationDate';
      // this is a warning: i forgot to implement enough checks and got spammed, this lagged my browser out , i got deafend and my sanity is now gone
      const lastNotificationDate = localStorage.getItem(todayKey);
      if (lastNotificationDate) {
        const lastDate = new Date(lastNotificationDate);
        if (lastDate.toDateString() === now.toDateString()) {
          return;
        }
      }
      const nextNotificationTime = new Date(now.setHours(9, 0, 0, 0)); //9AM
      const timeUntilNextNotification = nextNotificationTime - new Date();

      if (timeUntilNextNotification < 0) {
        nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
      }
      setTimeout(() => {
        sendNotification();
        localStorage.setItem(todayKey, new Date().toString());
      }, timeUntilNextNotification);
    };
    scheduleDailyNotification();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="nhsuk-container">
        <Routes>
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/wrap" element={<WRAPForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/game" element={<Game />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/recommended-recources" element={<RecommendedArticles />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
