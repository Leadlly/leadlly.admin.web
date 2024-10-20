import { FiSearch } from 'react-icons/fi'; 

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="p-1  border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center">
        <img src="/avatar.jpg" alt="User" className="h-8 w-8 rounded-full" />
        <span className="ml-2 font-semibold text-gray-700">Robert Pattinson</span>
      </div>
    </header>
  );
};

export default Header;
