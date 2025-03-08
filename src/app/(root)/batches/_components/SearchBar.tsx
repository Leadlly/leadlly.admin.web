import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative w-1/3">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      <Input
        type="text"
        placeholder="Search a teacher"
        className="w-full pl-12 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500 transition-all"
      />
    </div>
  );
};

export default SearchBar;
