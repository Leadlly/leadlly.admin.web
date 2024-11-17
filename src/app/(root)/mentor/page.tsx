import React from 'react';
import  Header  from '@/app/(root)/mentor/_components/Header';
import StatsCards from '@/app/(root)/mentor/_components/StatsCards';
import Graph from '@/app/(root)/mentor/_components/Graph';
import MentorDetails from '@/app/(root)/mentor/_components/MentorDetails';
import Goals from '@/app/(root)/mentor/_components/Goals';
import ProjectsList from '@/app/(root)/mentor/_components/ProjectsList';
import WeeklyProgress from '@/app/(root)/mentor/_components/WeeklyProgress'; // Import the WeeklyProgress component

const Mentor: React.FC = () => {
  return (
    <div className="relative h-full flex flex-col justify-start gap-3 xl:gap-6">
       <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <Header />
      </div>
    </div>
    <div className="flex-1">
    <h1>Hii,</h1>
    <h1>Welcome MENTOR Dashboard</h1>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StatsCards />
          <div className="space-y-4">
            <Graph />
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <Goals />
          <WeeklyProgress />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <MentorDetails />
        <ProjectsList />
      </div>
    </div>
  </div>
  );
};

export default Mentor;