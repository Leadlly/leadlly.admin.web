"use client";
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const WeeklyProgress: React.FC = () => {
  const percentage = 82.3; // Weekly progress value

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center">
      <h3 className="text-center text-lg font-semibold">Weekly Progress</h3>
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#000",
            pathColor: "#00C49F",
            trailColor: "#d6d6d6",
          })}
        />
      </div>
      <div className="text-center mt-4">
        <p>Daily Progress</p>
        <p className="font-bold">82.3%</p>
      </div>
    </div>
  );
};

export default WeeklyProgress;