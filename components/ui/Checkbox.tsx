import React from 'react';

interface CheckboxProps {
  id: string;
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-navy-blue focus:ring-gold border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
