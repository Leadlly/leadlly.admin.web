import { Plus } from "lucide-react";
import React from "react";
import BatchCard from "./BatchCard";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/batch";

interface Props {
  standard: string;
  batches: Batch[];
}

const StandardCard = ({ standard, batches }: Props) => {
  return (
    <div className="flex flex-col p-4 px-8 border border-[#C9C9C9] rounded-xl">
      <div className="flex justify-between my-4">
        <h2 className="text-xl font-semibold">{standard}</h2>
        <Button variant={"outline"}>
          <Plus size={16} color="#9654F4" className="hover:text-white" />
          <span className="text-[#9654F4]">Add batch</span>
        </Button>
      </div>
      <div className="space-y-4 grid lg:grid-cols-3 gap-4 sm:grid-cols-2 grid-cols-1">
        {/* <div className="space-y-4 flex justify-between items-start"> */}
        {batches.map((batch, index) => (
          <BatchCard batch={batch} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StandardCard;
