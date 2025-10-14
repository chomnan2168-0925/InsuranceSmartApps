import React from 'react';

interface LayoutWithSidebarProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children, sidebar }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      
      <div className="lg:col-span-8 flex flex-col">
        {children}
      </div>
      
      <div className="lg:col-span-4">
        {/* --- UPDATED: 'space-y-8' has been removed from this div --- */}
        <div className="sticky top-24">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;