// /components/calculators/CalculatorTabs.tsx
import React from 'react';

export interface CalculatorInfo {
  id: 'auto' | 'home' | 'life' | 'disability' | 'health' | 'pet';
  label: string;
  icon: JSX.Element;
  activeColorClass: string;
  hoverColorClass: string;
}

interface CalculatorTabsProps {
  types: CalculatorInfo[];
  selectedType: string;
  onTypeSelect: (id: CalculatorInfo['id']) => void;
  variant?: 'primary' | 'secondary';
}

const CalculatorTabs: React.FC<CalculatorTabsProps> = ({ 
  types, 
  selectedType, 
  onTypeSelect, 
  variant = 'primary' 
}) => {
  return (
    <div className="relative">
      {variant === 'primary' ? (
        // PRIMARY VARIANT - Modern Card Style with Icons
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {types.map((type) => {
            const isActive = type.id === selectedType;
            return (
              <button
                key={type.id}
                onClick={() => onTypeSelect(type.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-3 md:p-4
                  rounded-xl border-2 font-semibold transition-all duration-300
                  transform hover:scale-105 hover:shadow-lg
                  ${isActive
                    ? `bg-white shadow-xl ${type.activeColorClass} border-current scale-105`
                    : `bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border-gray-200 
                       hover:from-white hover:to-gray-50 ${type.hoverColorClass}`
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                style={{ 
                  zIndex: isActive ? 10 : 1,
                }}
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white shadow-sm animate-pulse" />
                )}
                
                {/* Icon */}
                <div className={`
                  transition-all duration-300
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}>
                  {type.icon}
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs md:text-sm font-bold
                  ${isActive ? 'text-current' : 'text-gray-700'}
                `}>
                  {type.label}
                </span>
                
                {/* Active underline */}
                {isActive && (
                  <div className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full
                    bg-gradient-to-r ${type.activeColorClass.replace('text-', 'from-').replace('border-', 'to-')}
                  `} />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        // SECONDARY VARIANT - Horizontal Tabs with Better Hover Effects
        <nav className="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-hide" aria-label="Calculator Tabs">
          {types.map((type) => {
            const isActive = type.id === selectedType;
            return (
              <button
                key={type.id}
                onClick={() => onTypeSelect(type.id)}
                className={`
                  relative flex items-center justify-center gap-2 whitespace-nowrap
                  px-4 py-3 font-medium text-sm transition-all duration-300
                  border-b-2 -mb-0.5
                  ${isActive
                    ? `${type.activeColorClass} border-current bg-gradient-to-t from-gray-50 to-transparent`
                    : `text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300`
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <span className={`
                  transition-transform duration-300
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}>
                  {type.icon}
                </span>
                
                {/* Label */}
                <span className="font-semibold">{type.label}</span>
                
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </nav>
      )}
      
      {/* Mobile scroll hint for primary variant */}
      {variant === 'primary' && (
        <div className="md:hidden text-center mt-2">
          <p className="text-xs text-gray-500">← Swipe to see all calculators →</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorTabs;