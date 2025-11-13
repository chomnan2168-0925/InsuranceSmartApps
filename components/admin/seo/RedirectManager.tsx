import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Redirect {
    id: number;
    source: string;
    destination: string;
    permanent: boolean;
}

const RedirectManager = () => {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [sourcePath, setSourcePath] = useState('');
    const [destinationPath, setDestinationPath] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    const fetchRedirects = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('redirects').select('*').order('createdAt', { ascending: false });
        if (error) {
            setStatusMessage(`Error: ${error.message}`);
        } else if (data) {
            setRedirects(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRedirects();
    }, []);

    const handleAddRedirect = async () => {
        if (!sourcePath || !destinationPath) {
            alert('Please fill in both paths.');
            return;
        }
        const formattedSource = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`;
        const formattedDestination = destinationPath.startsWith('/') ? destinationPath : `/${destinationPath}`;
        
        const { data, error } = await supabase
            .from('redirects')
            .insert([{ source: formattedSource, destination: formattedDestination, permanent: true }])
            .select();

        if (error) {
            alert(`Failed to add redirect: ${error.message}`);
        } else if (data) {
            setRedirects(prev => [data[0], ...prev]);
            setSourcePath('');
            setDestinationPath('');
        }
    };

    const handleDeleteRedirect = async (idToDelete: number) => {
        if (confirm('Are you sure you want to delete this redirect?')) {
            const { error } = await supabase.from('redirects').delete().eq('id', idToDelete);
            if (error) {
                alert(`Failed to delete redirect: ${error.message}`);
            } else {
                setRedirects(prev => prev.filter(redirect => redirect.id !== idToDelete));
            }
        }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue mb-4">Redirect Manager</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-gray-50">
          <input
            type="text"
            placeholder="/old-or-broken-path"
            value={sourcePath}
            onChange={e => setSourcePath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="text"
            placeholder="/new-destination-path"
            value={destinationPath}
            onChange={e => setDestinationPath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button onClick={handleAddRedirect} className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md">
            Add Redirect
          </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        {loading && <p className="p-4 text-center">Loading redirects...</p>}
        {statusMessage && !loading && <p className="p-4 text-center text-red-600">{statusMessage}</p>}
        {!loading && !statusMessage && (
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-3 font-semibold">From Path</th>
                  <th className="p-3 font-semibold">To Path</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((redirect) => (
                  <tr key={redirect.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm text-gray-800">{redirect.source}</td>
                    <td className="p-3 font-mono text-sm text-gray-800">{redirect.destination}</td>
                    <td className="p-3 text-gray-600">{redirect.permanent ? '301' : '302'}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleDeleteRedirect(redirect.id)}
                        className="text-red-600 hover:underline text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default RedirectManager;
