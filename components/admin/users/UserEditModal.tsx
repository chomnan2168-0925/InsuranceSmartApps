import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onUserUpdated: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onUserUpdated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Author');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'Author');
    } else {
      // Reset for new user invite
      setName('');
      setEmail('');
      setRole('Author');
    }
  }, [userToEdit, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Name cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      // GET THE SESSION TOKEN - THIS IS THE FIX!
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('You are not logged in. Please log in again.');
        setIsSaving(false);
        return;
      }

      console.log('Sending update request with auth token...');

      const response = await fetch('/api/admin/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the auth token in the Authorization header
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: userToEdit?.id,
          newName: name,
          newRole: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }

      alert('User updated successfully!');
      onUserUpdated();
      onClose();
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!email.trim() || !name.trim()) {
      alert('Email and name are required');
      return;
    }

    setIsSaving(true);

    try {
      // GET THE SESSION TOKEN
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('You are not logged in. Please log in again.');
        setIsSaving(false);
        return;
      }

      console.log('Sending invite request with auth token...');

      const response = await fetch('/api/admin/inviteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the auth token
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email,
          name,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to invite user');
      }

      alert('User invited successfully! They will receive an email.');
      onUserUpdated();
      onClose();
      
    } catch (error: any) {
      console.error('Error inviting user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-navy-blue">
            {userToEdit ? 'Edit User' : 'Invite New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-blue focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!userToEdit}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-blue focus:border-transparent ${
                userToEdit ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="user@example.com"
            />
            {userToEdit && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-blue focus:border-transparent"
            >
              <option value="Admin">Administrator</option>
              <option value="Author">Author</option>
              <option value="Viewer">Viewer</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {role === 'Admin' && 'Has full access to all site settings.'}
              {role === 'Author' && 'Can create and edit articles.'}
              {role === 'Viewer' && 'Can view content but cannot make changes.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={userToEdit ? handleSave : handleInvite}
            disabled={isSaving}
            className="px-4 py-2 bg-gold text-navy-blue font-semibold rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : userToEdit ? 'Save Changes' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;