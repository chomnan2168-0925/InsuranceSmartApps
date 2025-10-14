import React from 'react';
import DevAdminDashboard from '@/components/admin/dev/DevAdminDashboard';

const isDeveloperAuthenticated = () => {
  return process.env.NODE_ENV === 'development';
};

const DevAdminPage = () => {
  if (!isDeveloperAuthenticated()) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <DevAdminDashboard />;
};

export default DevAdminPage;