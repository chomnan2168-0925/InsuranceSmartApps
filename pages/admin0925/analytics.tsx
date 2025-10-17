// pages/admin0925/analytics.tsx

import React from 'react';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import withAuth from '@/components/auth/withAuth';

const AnalyticsPage = () => {
  return (
    <>
      <AnalyticsDashboard />
    </>
  );
};

export default withAuth(AnalyticsPage);
