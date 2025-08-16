import React from 'react';

const Card: React.FC<{ 
  className?: string;
  children: React.ReactNode;
}> = ({ children, className = '' }) => (
  <div className={`bg-white p-4 rounded-2xl shadow-md ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4">{children}</div>
);

export default Card;