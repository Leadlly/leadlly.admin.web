"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface BackButtonProps {
  router: AppRouterInstance;
}

const BackButton: React.FC<BackButtonProps> = ({ router }) => {
  return (
    <button
      onClick={() => router.back()}
      className="bg-purple-600 text-white px-3 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2"
    >
      <ArrowLeft size={16} />
    </button>
  );
};

export default BackButton;
