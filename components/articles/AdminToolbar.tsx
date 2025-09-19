import React from 'react';
import { useRouter } from 'next/router';

interface AdminToolbarProps {
  slug: string;
}

// This is a mock component. In a real app, you would check for user authentication.
const AdminToolbar: React.FC<AdminToolbarProps> = ({ slug }) => {
  const router = useRouter();
  const isAdmin = true; // Mocking admin status

  if (!isAdmin) {
    return null;
  }

  const handleEdit = () => {
    // In a real CMS, this would link to the edit page for this slug
    alert(`Navigating to edit page for: ${slug}`);
  };

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Admin View</p>
          <p>You are viewing this page as an administrator.</p>
        </div>
        <button
          onClick={handleEdit}
          className="bg-navy-blue text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
        >
          Edit Post
        </button>
      </div>
    </div>
  );
};

export default AdminToolbar;
