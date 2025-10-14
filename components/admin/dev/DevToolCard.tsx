import React from 'react';

interface DevToolCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const DevToolCard: React.FC<DevToolCardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <div className="mt-4 border-t pt-4">
        {children}
      </div>
    </div>
  );
};

export default DevToolCard;