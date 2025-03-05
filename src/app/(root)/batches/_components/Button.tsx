import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={`p-2 rounded ${className}`}>
      {children}
    </button>
  );
};

export default Button;