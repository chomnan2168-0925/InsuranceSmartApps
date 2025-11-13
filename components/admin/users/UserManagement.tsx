import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import UserEditModal from './UserEditModal';
import { User } from '@/types';
import { supabase } from '@/lib/supabaseClient';

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null); // Fixed type
  const [deleting, setDeleting] = useState<number | string | null>(null); // Fixed type

  // Fetch users from the database view
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from users_with_profiles view...');
      
      const { data, error: fetchError } = await supabase
        .from('users_with_profiles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        throw new Error(`Failed to fetch users: ${fetchError.message}`);
      }

      console.log('Fetched users:', data);

      // Transform the data to match our User type
      const formattedUsers: User[] = (data || []).map((user: any) => ({
        id: user.id,
        name: user.name || 'No Name Set',
        email: user.email || 'No email found',
        role: user.role || 'No Role Set',
        status: user.last_sign_in_at ? 'Active' : 'Invited',
      }));

      setUsers(formattedUsers);
      console.log('Formatted users:', formattedUsers);
      
    } catch (err: any) {
      console.error('Error in fetchUsers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const handleOpenInviteModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: number | string) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId);
      return;
    }

    setDeleting(userId);
    
    try {
      console.log('Deleting user:', userId);
      
      const response = await fetch('/api/admin/deleteUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: String(userId) }), // Convert to string for API
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete user');
      }

      console.log('User deleted successfully');
      
      // Refresh the user list
      await fetchUsers();
      setDeleteConfirm(null);
      
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1 text-center">
          <SectionHeader
            title="User Management"
            subtitle="Invite and manage user roles."
            className="text-center mb-0"
          />
        </div>
        <button 
          onClick={handleOpenInviteModal} 
          className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md transition-colors"
        >
          + Invite User
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <input 
          type="text" 
          placeholder="Search by name or email..."
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy-blue"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-semibold mb-2">Error: {error}</p>
            <p className="text-sm text-gray-600 mb-3">
              Make sure you've created the 'users_with_profiles' view in Supabase SQL Editor.
            </p>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-blue-900 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && filteredUsers.length === 0 && (
          <p className="p-4 text-center text-gray-600">No users found.</p>
        )}
        
        {!loading && !error && filteredUsers.length > 0 && (
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="p-3 font-semibold text-gray-700">Name</th>
                <th className="p-3 font-semibold text-gray-700">Email</th>
                <th className="p-3 font-semibold text-gray-700">Role</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 text-gray-600">{user.role}</td>
                  <td className="p-3">
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        className="text-navy-blue hover:underline text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      
                      {deleteConfirm === user.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleting === user.id}
                            className="text-red-600 hover:underline text-sm font-semibold disabled:opacity-50 transition-colors"
                          >
                            {deleting === user.id ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={cancelDelete}
                            disabled={deleting === user.id}
                            className="text-gray-600 hover:underline text-sm disabled:opacity-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:underline text-sm font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
};

export default UserManagement;
