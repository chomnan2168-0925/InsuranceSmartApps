import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CalculatorInput {
  label: string;
  value: string;
}

export interface CalculatorResult {
  type: 'auto' | 'home' | 'life' | 'disability' | 'health' | 'pet';
  result: string;
  inputs: CalculatorInput[];
  timestamp?: number;
}

interface CalculatorContextType {
  latestResult: CalculatorResult | null;
  allResults: CalculatorResult[];
  saveResult: (result: CalculatorResult) => void;
  clearResults: () => void;
  compareMode: boolean;
  setCompareMode: (mode: boolean) => void;
  selectedForCompare: CalculatorResult[];
  toggleCompareSelection: (result: CalculatorResult) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [latestResult, setLatestResult] = useState<CalculatorResult | null>(null);
  const [allResults, setAllResults] = useState<CalculatorResult[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<CalculatorResult[]>([]);

  const saveResult = (result: CalculatorResult) => {
    const timestampedResult = { ...result, timestamp: Date.now() };
    setLatestResult(timestampedResult);
    setAllResults(prev => [timestampedResult, ...prev.slice(0, 9)]); // Keep last 10
  };

  const clearResults = () => {
    setLatestResult(null);
    setAllResults([]);
    setSelectedForCompare([]);
  };

  const toggleCompareSelection = (result: CalculatorResult) => {
    setSelectedForCompare(prev => {
      const exists = prev.find(r => r.timestamp === result.timestamp);
      if (exists) {
        return prev.filter(r => r.timestamp !== result.timestamp);
      }
      if (prev.length >= 3) return prev; // Max 3 comparisons
      return [...prev, result];
    });
  };

  return (
    <CalculatorContext.Provider value={{
      latestResult,
      allResults,
      saveResult,
      clearResults,
      compareMode,
      setCompareMode,
      selectedForCompare,
      toggleCompareSelection
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculatorContext = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext must be used within CalculatorProvider');
  }
  return context;
};