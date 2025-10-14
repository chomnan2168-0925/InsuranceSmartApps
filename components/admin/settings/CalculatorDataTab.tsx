import React from 'react';

// Mock data for the new table structure
const mockRates = [
    { id: 1, type: 'Life Insurance', country: 'USA', subdivision: 'All', rate: '1.5% (Multiplier)' },
    { id: 2, type: 'Auto Insurance', country: 'USA', subdivision: 'California', rate: '$150/mo (Base)' },
    { id: 3, type: 'Auto Insurance', country: 'USA', subdivision: 'Texas', rate: '$140/mo (Base)' },
    { id: 4, type: 'Auto Insurance', country: 'Canada', subdivision: 'All', rate: '$165/mo (Base)' },
];

const CalculatorData = () => {
    return (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h3 className="text-xl font-bold text-navy-blue">Calculator Benchmark Rates</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage rates by Insurance Type, Country, and Subdivision.</p>
                </div>
                <button className="px-4 py-2 bg-gold text-navy-blue font-bold rounded-md flex-shrink-0">Add New Rate</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b"><th className="p-3">Type</th><th className="p-3">Country</th><th className="p-3">Subdivision (State/Province)</th><th className="p-3">Rate</th><th className="p-3">Actions</th></tr>
                    </thead>
                    <tbody>
                        {mockRates.map(rate => (
                            <tr key={rate.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{rate.type}</td>
                                <td className="p-3">{rate.country}</td>
                                <td className="p-3">{rate.subdivision}</td>
                                <td className="p-3 font-semibold">{rate.rate}</td>
                                <td className="p-3 space-x-3 text-sm">
                                    <button className="text-navy-blue hover:underline font-semibold">Edit</button>
                                    <button className="text-red-600 hover:underline font-semibold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CalculatorData;