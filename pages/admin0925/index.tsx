// pages/admin0925/index.tsx

import React from 'react';
import Dashboard from '@/components/admin/Dashboard';
import withAuth from '@/components/auth/withAuth';

const AdminDashboardPage = () => {
  return <Dashboard />;
};

export default withAuth(AdminDashboardPage);
