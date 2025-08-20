
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const classes = `bg-white rounded-xl shadow-md overflow-hidden p-6 ${className}`;
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;