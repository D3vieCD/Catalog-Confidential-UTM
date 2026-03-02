interface SettingsToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}
import React from 'react';
import { motion } from 'framer-motion';

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  enabled,
  onChange
}) => {
  return (
    <div>
    </div>
  );
};
<div className="flex items-center justify-between py-4">
  <div className="flex-1">
    <h3>{label}</h3>
    {description && <p>{description}</p>}
  </div>
</div>
<h3 className="text-base font-semibold text-gray-900 dark:text-white">
  {label}
</h3>

{description && (
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
    {description}
  </p>
)}
<button
  onClick={() => onChange(!enabled)}
  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
    enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
  }`}
>
</button>
<motion.span
  layout
  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
    enabled ? 'translate-x-7' : 'translate-x-1'
  }`}
/>