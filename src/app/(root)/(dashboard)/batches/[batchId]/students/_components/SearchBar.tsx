import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mb-6 bg-[#EFEFEFAB] rounded-lg flex items-center">
      <Input
        type="text"
        placeholder={"Search a teacher"}
        className="border-none font-normal focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0"
      />
      <Search className="text-gray-400 mx-4" size={20} />
    </div>
  );
}
