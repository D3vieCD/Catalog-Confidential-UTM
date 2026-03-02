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