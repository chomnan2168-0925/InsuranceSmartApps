import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import InviteUserModal from './InviteUserModal';

// Mock data, in a real app this would come from an API
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'Editor One', email: 'editor1@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Editor Two', email: 'editor2@example.com', role: 'Editor', status: 'Pending' },
];

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeader title="User Management" className="text-left mb-0" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md transition-colors"
        >
          + Invite User
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{user.name}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.role}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {user.status}
                    </span>
                </td>
                <td className="p-3">
                  <button className="text-navy-blue hover:underline text-sm font-semibold">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserManagement;
