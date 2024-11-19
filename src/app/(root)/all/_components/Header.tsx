"use client";
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-end items-center pt-2">
      <div className="flex items-center">
        <img src="/avatar.jpg" alt="User" className="h-8 w-8 rounded-full" />
        <span className="ml-2">Robert Pattinson</span>
      </div>
    </header>
  );
};

export default Header;
