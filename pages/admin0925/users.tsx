// pages/admin0925/users.tsx

import React from 'react';
import UserManagement from '@/components/admin/users/UserManagement';
import withAuth from '@/components/auth/withAuth';

const UsersPage = () => {
  return (
    <>
      <UserManagement />
    </>
  );
};

export default withAuth(UsersPage);
