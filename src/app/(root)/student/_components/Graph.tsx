"use client";

import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useEffect, useRef } from 'react';

// Register necessary components with Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const Graph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'line'> | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');

    if (ctx && chartInstanceRef.current === null) {
      // Define chart data and options
      const data: ChartData<'line'> = {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            label: 'Example Dataset',
            data: [65, 59, 80, 81],
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      };

      const options: ChartOptions<'line'> = {
        responsive: true,
      };

      // Create the chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
    }

    // Cleanup on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default Graph;
