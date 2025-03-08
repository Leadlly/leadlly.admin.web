import React, { useState } from "react";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, className }) => {
  const [selected, setSelected] = useState<string>(options[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-60 ${className}`}>
      <button 
        className="bg-white border rounded p-2 w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded mt-1 w-full z-10 shadow-lg max-h-48 overflow-auto min-w-max">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer w-full whitespace-nowrap"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
