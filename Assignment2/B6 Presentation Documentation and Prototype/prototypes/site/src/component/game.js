import React, { useState, useEffect } from 'react';
import UnityWebGL from './UnityWebGL.js';

const Game = () => {
  const [petName, setPetName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPetName = async () => {
      try {
        const response = await fetch('http://localhost:5000/getPetName', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.petName) {
          setSavedName(data.petName);
          setPetName(data.petName);
        }
      } catch (err) {
        console.error('Failed to fetch pet name:', err);
      }
    };
    fetchPetName();
  }, [token]);
  const handleUpdatePetName = async () => {
    try {
      const response = await fetch('http://localhost:5000/updatePetName', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petName }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Pet name updated!');
        setSavedName(petName);
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };
  return (
    <div>
     <UnityWebGL />
      <div style={{ marginTop: 20 }}>
        {savedName ? (
          <p>Your pet's name is: <strong>{savedName}</strong></p>
        ) : (
          <p>You haven't named your pet yet!</p>
        )}
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Name or rename your pet"
        />
        <button onClick={handleUpdatePetName}>
          {savedName ? 'Update Pet Name' : 'Save Pet Name'}
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Game;
