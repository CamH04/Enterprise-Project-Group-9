import React from 'react';
import './unity-server.css';

const UnityWebGL = () => {
  return (
    <div>
      <iframe className="game-v"
        src="http://localhost:4040"
        width="1000"
        height="800"
      ></iframe>
    </div>
  );
};

export default UnityWebGL;
