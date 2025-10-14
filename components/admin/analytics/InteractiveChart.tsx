import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register all necessary components, including 'Filler' for area charts
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

interface ChartProps {
  title: string;
  type?: 'line' | 'pie';
  data: any; // Accept chart data as a prop
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    interaction: { intersect: false, mode: 'index' as const }, // Better tooltips
};

const InteractiveChart: React.FC<ChartProps> = ({ title, type = 'line', data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-xl font-bold text-navy-blue mb-4">{title}</h3>
      <div className="relative flex-grow min-h-[320px]">
        {/* The component now uses the 'data' prop instead of its own mock data */}
        {type === 'line' ? (
          <Line options={chartOptions} data={data} />
        ) : (
          <Pie options={chartOptions} data={data} />
        )}
      </div>
    </div>
  );
};

export default InteractiveChart;