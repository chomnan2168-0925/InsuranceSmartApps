import React, { useState } from 'react';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [message, setMessage] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleInvite = () => {
    // Mock invite logic
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }
    setMessage(`Invitation sent to ${email} with role ${role}. (Mock)`);
    console.log(`Inviting user: ${email}, Role: ${role}`);
    // In a real app, you'd call an API here.
    // Optionally close after a delay
    setTimeout(() => {
        onClose();
        setMessage('');
        setEmail('');
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-navy-blue">Invite New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-navy-blue focus:border-navy-blue"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role" value={role} onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-navy-blue focus:border-navy-blue rounded-md"
            >
              <option>Editor</option>
              <option>Administrator</option>
            </select>
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button onClick={handleInvite} className="px-4 py-2 bg-gold text-navy-blue rounded-md hover:bg-yellow-400 font-semibold">Send Invitation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
