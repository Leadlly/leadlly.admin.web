// Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    header: React.ReactNode;
    body: React.ReactNode;
    footer: React.ReactNode;
  }

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, header, body, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-90 flex justify-center">
    <div className="bg-white rounded-lg p-4 w-full md:w-3/5 lg:w-2/3 xl:w-1/2 h-3/4 overflow-y-auto mt-20">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-lg font-bold">{title}</h2> */}
        <button
          className="text-gray-600 hover:text-gray-900 transition duration-300"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {header}
      <div className='overflow-y-auto h-64'>
      {body}
      </div>
      {footer}
    </div>
  </div>
  );
};

export default Modal;