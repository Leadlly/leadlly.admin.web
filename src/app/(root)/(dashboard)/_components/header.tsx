import { Button } from "@/components/ui/button";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center my-6 gap-4">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center sm:text-left">
        Institute Overview & Management
      </h1>
      <Button
        variant="default"
        className="bg-[#9654F4] hover:bg-[#8b48e8] w-[100px] md:w-[130px] md:h-[45px] text-lg flex items-center justify-center gap-2"
      >
<svg className="w-7 h-7" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">

          <path
            d="M4.80694 14.4681L3.95801 17.8638L7.35372 17.0148L17.1892 7.17934C17.8523 6.51629 17.8523 5.44126 17.1892 4.77821L17.0436 4.63256C16.3805 3.9695 15.3055 3.9695 14.6424 4.63256L4.80694 14.4681Z"
            stroke="white"
            strokeWidth="1.69786"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.2961 5.97878L15.8429 8.52556"
            stroke="white"
            strokeWidth="1.69786"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5983 17.8638H18.3897"
            stroke="white"
            strokeWidth="1.69786"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Edit</span>
      </Button>
    </div>
  );
};

export default Header;
