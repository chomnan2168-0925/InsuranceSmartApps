import React from 'react';

// A reusable component for our health checks
const HealthCheckItem = ({ label, status, detail }: { label: string, status: 'Healthy' | 'Warning' | 'Error', detail: string }) => {
    const statusStyles = {
        Healthy: 'bg-green-100 text-green-800',
        Warning: 'bg-yellow-100 text-yellow-800',
        Error: 'bg-red-100 text-red-800',
    };
    return (
        <div className="flex justify-between items-center p-3 border-b last:border-b-0">
            <p className="font-medium text-sm">{label}</p>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{detail}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
            </div>
        </div>
    );
// === THIS IS THE MISSING BRACE THAT FIXES THE ERROR ===
};

const AdvancedSeoTools = () => {
    const handleGenerateSitemap = () => {
        alert('Generating a new sitemap.xml... This can take a few minutes. (Mock)');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-navy-blue mb-4">Technical SEO Site Health</h3>
            <div className="border rounded-lg">
                <HealthCheckItem label="XML Sitemap" status="Healthy" detail="sitemap.xml is accessible" />
                <HealthCheckItem label="Robots.txt File" status="Healthy" detail="robots.txt is configured" />
                <HealthCheckItem label="Custom 404 Page" status="Healthy" detail="Friendly 404 page is active" />
                <HealthCheckItem label="HTTPS Encryption" status="Healthy" detail="Site is secure" />
            </div>
            
            <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800">XML Sitemap</h4>
                <div className="flex items-center justify-between mt-2 text-sm">
                    <p className="text-gray-600">Manually regenerate the sitemap.xml to include your latest content.</p>
                    <button 
                        onClick={handleGenerateSitemap}
                        className="px-4 py-2 bg-gold text-navy-blue font-bold rounded-md flex-shrink-0"
                    >
                        Generate sitemap.xml
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSeoTools;