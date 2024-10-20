import React from 'react';
import { Header } from '../../../components';
import StatsCards from '../../../components/shared/StatsCards';
import Graph from '../../../components/shared/Graph';
import UnpaidInvoices from '../../../components/shared/UnpaidInvoices';
import Goals from '../../../components/shared/Goals';
import ProjectsList from '../../../components/shared/ProjectList';
import WeeklyProgress from '../../../components/shared/WeeklyProgress'; // Import the WeeklyProgress component

const Mentordashboard: React.FC = () => {
  return (
    <div className="relative h-full flex flex-col justify-start gap-3 xl:gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Header />
        </div>
      </div>

      <div className="flex-1">
  <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
    {/* Left section with StatsCards, Graph, UnpaidInvoices, and ProjectsList */}
    <div className="lg:col-span-2">
      <StatsCards />
      <div className="space-y-4">
        <Graph />
        {/* Make a new grid layout for UnpaidInvoices and ProjectsList to expand their width */}
        <div className="grid grid-cols-2 gap-4">
          <UnpaidInvoices />
          <ProjectsList />
        </div>
      </div>
    </div>

    {/* Right section with Goals and WeeklyProgress */}
    <div className="w-full lg:w-1/3 space-y-4">
      <Goals />
      <WeeklyProgress />
    </div>
  </div>
</div>

    </div>
  );
};

export default Mentordashboard;
