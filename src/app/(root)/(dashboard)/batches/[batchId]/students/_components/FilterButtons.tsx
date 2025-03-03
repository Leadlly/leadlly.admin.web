import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface FilterButtonsProps {
  filter: string;
  setFilter: (filter: string) => void;
  options: string[];
}

export default function FilterButtons({
  filter,
  setFilter,
  options,
}: FilterButtonsProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {options.map((option) => (
        <Button
          key={option}
          className={
            filter === option ? "bg-purple-500 hover:bg-purple-700" : ""
          }
          variant={filter === option ? "default" : "outline"}
          onClick={() => setFilter(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Button>
      ))}
      <SlidersHorizontal className="cursor-pointer text-slate-500" />
    </div>
  );
}
