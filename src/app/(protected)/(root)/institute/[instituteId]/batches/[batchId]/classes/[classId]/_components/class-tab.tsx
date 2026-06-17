"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

const ClassTab = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const instituteId = params.instituteId as string;
  const batchId = params.batchId as string;
  const classId = params.classId as string;

  const base = `/institute/${instituteId}/batches/${batchId}/classes/${classId}`;

  const tabs = [
    { name: "Report", href: `${base}/report` },
    { name: "Students", href: `${base}/students` },
    { name: "Add work", href: `${base}/add-work` },
  ];

  return (
    <div className="flex border-b border-gray-100 mb-4 md:mb-8 gap-3 md:gap-8 bg-white overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={{
              pathname: tab.href,
              query: searchParams.toString(),
            }}
            className={`pb-3 md:pb-4 text-xs md:text-[15px] font-bold transition-all relative whitespace-nowrap shrink-0 ${
              isActive
                ? "text-[#A855F7]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.name}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#A855F7] rounded-t-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ClassTab;
