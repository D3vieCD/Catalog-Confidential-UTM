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