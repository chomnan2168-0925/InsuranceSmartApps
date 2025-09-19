
import React from 'react';

const CalculatorData = () => {
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Saving calculator settings... (Mock)');
    };

    return (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h3 className="text-xl font-bold text-navy-blue">Calculator Default Values</h3>
            <p className="text-sm text-gray-600">
                Manage the default values and assumptions used in the public-facing calculators.
            </p>

            {/* Life Insurance Calculator */}
            <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Life Insurance Calculator</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm">Default Income ($)</label>
                        <input type="number" defaultValue="75000" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm">Default Years</label>
                        <input type="number" defaultValue="10" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Auto Insurance Calculator */}
            <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Auto Insurance Calculator</h4>
                <div>
                    <label className="block text-sm">Base Monthly Rate ($)</label>
                    <input type="number" defaultValue="120" className="mt-1 w-full p-2 border border-gray-300 rounded-md max-w-xs" />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md">
                    Save Calculator Data
                </button>
            </div>
        </form>
    );
};

export default CalculatorData;
