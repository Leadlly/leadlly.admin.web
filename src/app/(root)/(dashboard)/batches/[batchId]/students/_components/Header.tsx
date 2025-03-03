import { Bell, SquareUser, Users } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-semibold">Students Info</h1>
      <div className="flex gap-8 items-center">
        <div className="border p-2 rounded-xl flex gap-4">
          <div className="p-1.5">
            <SquareUser size={20} />
          </div>
          <div className="bg-purple-500 p-1.5 rounded-md">
            <Users color="white" size={20} />
          </div>
        </div>
        <div>
          <Bell size={24} />
        </div>
        <div className="h-10 w-10 rounded-full">
          <img src="/images/profile.png" className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Header;
