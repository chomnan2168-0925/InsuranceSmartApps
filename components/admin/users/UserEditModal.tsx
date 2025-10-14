import React, { useState, useEffect } from 'react';
import { User } from '@/types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onUserUpdated: () => void;
}

const roles = [
  { name: 'Administrator', description: 'Has full access to all site settings.' },
  { name: 'Editor', description: 'Can create, edit, and publish any content.' },
  { name: 'Author', description: 'Can create and edit their own content, but not publish.' },
];

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  isOpen, 
  onClose, 
  userToEdit, 
  onUserUpdated 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Author');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isSaving, setIsSaving] = useState(false);
  
  const isEditing = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'Author');
    } else {
      setName('');
      setEmail('');
      setRole('Author');
    }
    setMessage('');
    setMessageType('success');
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter an email address.');
      setMessageType('error');
      return;
    }

    if (!name.trim()) {
      setMessage('Please enter a name.');
      setMessageType('error');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      if (isEditing) {
        // Update existing user
        console.log('Updating user:', { userId: userToEdit?.id, newRole: role, newName: name });
        
        const response = await fetch('/api/admin/updateUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: userToEdit?.id, 
            newRole: role, 
            newName: name 
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to update user');
        }
        
        setMessage('User updated successfully!');
        setMessageType('success');
        
      } else {
        // Invite new user
        console.log('Inviting user:', { email, role, name });
        
        const response = await fetch('/api/admin/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role, name }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to invite user');
        }

        setMessage('Invitation sent successfully!');
        setMessageType('success');
      }

      // Refresh the user list
      await onUserUpdated();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error:', err);
      setMessage(err.message || 'An unexpected error occurred');
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-navy-blue">
            {isEditing ? 'Edit User' : 'Invite New User'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="user@example.com"
              disabled={isEditing}
              required
            />
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            >
              {roles.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {roles.find(r => r.name === role)?.description}
            </p>
          </div>

          {message && (
            <div 
              className={`p-3 rounded-md ${
                messageType === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-gold text-navy-blue rounded-md font-semibold hover:bg-yellow-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Send Invitation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;