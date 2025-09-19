// FIX: Implemented a functional RedirectManager component for the SEO Hub.
import React, { useState } from 'react';

const mockRedirects = [
  { id: 1, from: '/old-page', to: '/new-page', type: 301 },
  { id: 2, from: '/another-old-link', to: '/blog/post', type: 301 },
];

const RedirectManager = () => {
    const [fromPath, setFromPath] = useState('');
    const [toPath, setToPath] = useState('');

    const handleAddRedirect = () => {
        if (!fromPath || !toPath) {
            alert('Please fill in both paths.');
            return;
        }
        alert(`Adding redirect from ${fromPath} to ${toPath}. (Mock)`);
        // In a real app, you would call an API here and update the state
        setFromPath('');
        setToPath('');
    }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold text-navy-blue mb-4">Redirect Manager</h3>
      
      {/* Add Redirect Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md">
          <input
            type="text"
            placeholder="/from/path"
            value={fromPath}
            onChange={e => setFromPath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="text"
            placeholder="/to/path"
            value={toPath}
            onChange={e => setToPath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button onClick={handleAddRedirect} className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md">
            Add Redirect
          </button>
      </div>

      {/* Redirects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b">
              <th className="p-3">From Path</th>
              <th className="p-3">To Path</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRedirects.map((redirect) => (
              <tr key={redirect.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-sm text-gray-800">{redirect.from}</td>
                <td className="p-3 font-mono text-sm text-gray-800">{redirect.to}</td>
                <td className="p-3 text-gray-600">{redirect.type}</td>
                <td className="p-3">
                  <button className="text-red-600 hover:underline text-sm font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RedirectManager;
