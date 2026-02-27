import React from 'react';
import '../styles/Logo.css';

const Logo = ({ size = 'lg', variant = 'light' }) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`logo-container flex items-center gap-3 ${sizeClass}`}>
      <div className={`logo-icon ${sizeClass} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle cx="50" cy="50" r="48" fill={variant === 'light' ? '#ffffff' : '#dbeafe'} opacity="0.2" />
          
          {/* Main coins/circles */}
          <circle cx="35" cy="35" r="18" fill={variant === 'light' ? '#fbbf24' : '#f59e0b'} opacity="0.9" />
          <circle cx="50" cy="50" r="20" fill={variant === 'light' ? '#10b981' : '#059669'} opacity="0.9" />
          <circle cx="65" cy="65" r="16" fill={variant === 'light' ? '#3b82f6' : '#2563eb'} opacity="0.9" />
          
          {/* Dollar signs */}
          <text x="35" y="42" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">$</text>
          <text x="50" y="58" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">$</text>
          <text x="65" y="72" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">$</text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
