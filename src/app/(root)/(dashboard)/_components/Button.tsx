import React from "react";
import { Button as ShadCnButton } from "@/components/ui/button";

interface ButtonProps {
  label?: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, children }) => {
  return (
    <ShadCnButton onClick={onClick} className={className}>
      {label}
      {children}
    </ShadCnButton>
  );
};

export default Button;