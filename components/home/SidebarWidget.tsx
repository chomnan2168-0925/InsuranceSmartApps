import React from 'react';

interface SidebarWidgetProps {
  title: string;
  children: React.ReactNode;
}

const SidebarWidget: React.FC<SidebarWidgetProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold text-navy-blue border-b-2 border-gold pb-2 mb-4">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default SidebarWidget;
