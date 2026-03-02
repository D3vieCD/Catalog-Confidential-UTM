interface SettingsSelectOption {
  value: string;
  label: string;
}
interface SettingsSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SettingsSelectOption[];
  icon?: React.ReactNode;
}
import React from 'react';

export const SettingsSelect: React.FC<SettingsSelectProps> = ({
  label,
  value,
  onChange,
  options,
  icon
}) => {
  return (
    <div>
    </div>
  );
};
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {label}
  </label>
  <div className="relative">
  </div>
</div>
{icon && (
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
    {icon}
  </div>
)}
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer`}
>
  {options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
  </svg>
</div>