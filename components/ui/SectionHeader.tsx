import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = '' }) => {
  // Helper function to shorten month names (this function is good and will remain)
  const formatShortMonths = (text: string) => {
    const shortMonths: Record<string, string> = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };
    return text.replace(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
      match => shortMonths[match]
    );
  };

  const formattedSubtitle = subtitle ? formatShortMonths(subtitle) : '';

  return (
    // --- THE FIX: 'mb-4' and 'md:mb-4' have been removed from this line ---
    // The component no longer forces a margin below itself.
    <div className={`text-center ${className}`}>
      {/* Tighter line spacing for the title */}
      <h2 className="text-3xl md:text-lg font-bold text-navy-blue mb-2 mt-4 leading-tight">
        {title}
      </h2>
      {formattedSubtitle && (
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-snug -mt-2 -mb-2">
          {formattedSubtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;