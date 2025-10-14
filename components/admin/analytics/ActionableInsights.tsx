import React from 'react';

const insights = [
    {
        title: "Visitor growth is strong",
        text: "You've seen an 8.1% increase in unique visitors this month. Keep up the momentum by publishing fresh content.",
        color: "green"
    },
    {
        title: "Improve page stickiness",
        text: "Your bounce rate is 45.2%. Try adding internal links to popular articles to keep users engaged on the site longer.",
        color: "yellow"
    },
    {
        title: "Organic search is winning",
        text: "Over 60% of your traffic comes from search engines. Focus on SEO for your new articles to capitalize on this.",
        color: "blue"
    }
];

const ActionableInsights = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-navy-blue mb-4">Actionable Insights</h3>
            <div className="space-y-4">
                {insights.map(insight => (
                    <div key={insight.title} className={`p-3 rounded-md border-l-4 ${
                        insight.color === 'green' ? 'border-green-500 bg-green-50' :
                        insight.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                    }`}>
                        <h4 className="font-bold text-gray-800">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActionableInsights;