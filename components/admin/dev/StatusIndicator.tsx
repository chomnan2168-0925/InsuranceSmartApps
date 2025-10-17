import React from 'react';
import withAuth from '@/components/auth/withAuth';

// Define the possible statuses
type Status = 'operational' | 'degraded' | 'error' | 'loading';

interface StatusIndicatorProps {
  status: Status;
  label: string;
}

// Define the properties for each status
const statusConfig = {
  operational: { text: 'Operational', color: 'bg-green-500' },
  degraded: { text: 'Degraded Performance', color: 'bg-yellow-500' },
  error: { text: 'Major Outage / Error', color: 'bg-red-500' },
  // --- THIS IS THE FIX: Added a 'loading' status ---
  loading: { text: 'Checking Status...', color: 'bg-gray-400 animate-pulse' }, 
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  // Safely get the current status, with a fallback for unknown statuses
  const currentStatus = statusConfig[status] || { text: 'Unknown', color: 'bg-gray-300' };

  return (
    <div className="flex justify-between items-center p-3 border-b last:border-b-0">
      <span className="font-medium text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {/* The color class is now safely applied */}
        <div className={`w-3 h-3 rounded-full ${currentStatus.color}`}></div>
        <span className="text-sm text-gray-700">{currentStatus.text}</span>
      </div>
    </div>
  );
};

export default withAuth(StatusIndicator);
