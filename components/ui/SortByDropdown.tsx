import React from 'react';

const SortByDropdown = () => {
    return (
        <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort By:</label>
                <select
                    id="sort-by"
                    name="sort-by"
                    className="pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md"
                    defaultValue="latest"
                >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>
        </div>
    );
};

export default SortByDropdown;
