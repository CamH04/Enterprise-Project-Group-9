import React from 'react';

const Button = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="nhsuk-button">
      {children}
    </button>
  );
};

export default Button;
