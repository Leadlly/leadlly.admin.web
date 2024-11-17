"use client";
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
        <input
          type="text"
          placeholder="Search here..."
          className="p-2 border rounded-md"
        />
      </div>
      <div className="flex items-center">
        <img src="/avatar.jpg" alt="User" className="h-8 w-8 rounded-full" />
        <span className="ml-2">Robert Pattinson</span>
      </div>
    </header>
  );
};

export default Header;
