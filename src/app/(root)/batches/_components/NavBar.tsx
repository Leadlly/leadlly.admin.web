"use client";

import React from "react";
import Image from "next/image";
import { Bell, Users, Image as ImageIcon } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-end items-center gap-6 p-4 bg-white shadow-md rounded-lg">
      {/* Grouped Icons */}
      <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
        <ImageIcon className="text-gray-600 cursor-pointer hover:text-purple-600 transition-all" size={22} />
        <Users className="text-gray-600 cursor-pointer hover:text-purple-600 transition-all" size={22} />
      </div>

      {/* Notification Icon */}
      <Bell className="text-gray-600 cursor-pointer hover:text-purple-600 transition-all" size={22} />

      {/* Profile Picture */}
      <Image
        src="/student1.png" // Replace with actual profile image URL
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full cursor-pointer"
      />
    </nav>
  );
};

export default NavBar;
