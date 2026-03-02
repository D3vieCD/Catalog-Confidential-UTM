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