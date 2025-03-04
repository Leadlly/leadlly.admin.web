import React from 'react';
import Link from 'next/link';
import { Users, GraduationCap, LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

interface StatisticsOverviewProps {
  title: string;
  stats: StatItem[];
  variant: 'student' | 'teacher';
  linkHref: string;
  linkText: string;
}

const StatisticsOverview = ({
  title,
  stats,
  variant,
  linkHref,
  linkText,
}: StatisticsOverviewProps) => {
  const colors = {
    student: {
      border: 'border-customGreenBorder',
      icon: 'text-green-500',
      link: 'bg-green-100 hover:bg-green-200 text-green-700',
    },
    teacher: {
      border: 'border-customBlueBorder',
      icon: 'text-blue-500',
      link: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
    },
  }[variant];

  return (
    <div className={`bg-white p-6 rounded-3xl shadow-section border ${colors.border}`}>
      <h2 className="text-xl font-medium mb-6">{title}</h2>

      <div className="grid grid-cols-2 gap-6 mb-6 px-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <h3 className="text-gray-600 mb-2 px-4">{stat.label}</h3>
            <div className="flex items-center gap-2 px-4">
              <stat.icon size={24} className={colors.icon} />
              <span className="text-3xl font-medium">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href={linkHref} 
        className={`${colors.link} flex items-center justify-center gap-2 py-3 rounded-md transition`}
      >
        <span>{variant === 'teacher' ? <GraduationCap size={16} /> : <Users size={16} />}</span>
        &nbsp;{linkText}
      </Link>
    </div>
  );
};

export default StatisticsOverview;