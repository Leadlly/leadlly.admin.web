import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(
  CategoryScale,  // Register the category scale for x-axis
  LinearScale,    // Register the linear scale for y-axis
  LineElement, 
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const Graph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');

    if (ctx && chartInstanceRef.current === null) {
      // Create the chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April'],
          datasets: [{
            label: 'Example Dataset',
            data: [65, 59, 80, 81],
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
          }],
        },
        options: {
          responsive: true,
        },
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
