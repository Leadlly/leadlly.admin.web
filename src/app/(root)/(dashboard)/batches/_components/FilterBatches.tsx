import { SlidersHorizontal } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterBatches = () => {
  return (
    <div className="shadow-sm p-4">
      <div className="flex gap-3 px-4 text-lg items-center">
        <SlidersHorizontal size={20} className="text-slate-500" />
        <span className="text-slate-500 mr-4">Filter by :</span>
        {[1, 2, 3].map((item) => {
          return (
            <Select key={item}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="text-black">
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBatches;
