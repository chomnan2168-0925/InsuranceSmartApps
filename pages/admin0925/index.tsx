// pages/admin0925/index.tsx

import React from 'react';
import Dashboard from '@/components/admin/Dashboard';

const AdminDashboardPage = () => {
  // The page now ONLY returns its direct content.
  // The AdminLayout is now provided by _app.tsx.
  return <Dashboard />;
};

export default AdminDashboardPage;