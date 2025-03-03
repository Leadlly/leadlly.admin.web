import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Batch } from "@/types/batch";

interface Props {
  batch: Batch;
  index: number;
}

const BatchCard = (props: Props) => {
  const { batch, index } = props;
  return (
    <Card key={index} className="border-gray-200 p-2" style={{ margin: 0 }}>
      <CardHeader className="p-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-[#1472FF]"></div>

            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold">
                {batch.className}
              </CardTitle>
              <span className="text-xs text-slate-500">{batch.standard}</span>
            </div>
          </div>
          <Badge className="bg-[#2CEB1A26] hover:bg-[#2CEB1A26] text-[#10AE1C] shadow-none">
            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Subject:</span>
          {batch.subjects.map((subject, idx) => (
            <Badge key={idx} variant="outline" className="text-gray-600">
              {subject}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Total Students: {batch.totalStudents}
          </p>
          <div className="flex items-center gap-2">
            <Progress
              indicatorColor="bg-purple-500"
              value={(batch.totalStudents / batch.maxCapacity) * 100}
              className="h-2"
            />
            <span className="text-sm text-gray-500">
              {batch.totalStudents}/{batch.maxCapacity}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex p-2 justify-between items-center pt-4 border-t">
        <p className="text-sm text-gray-600">By {batch.instructor}</p>
        <Button
          asChild
          className="bg-purple-500 hover:bg-purple-700"
          size={"sm"}
        >
          <Link href={"/batches/2/students"}> View More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BatchCard;
