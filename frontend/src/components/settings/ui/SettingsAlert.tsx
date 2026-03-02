interface SettingsAlertProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
}
import React from 'react';

export const SettingsAlert: React.FC<SettingsAlertProps> = ({
  type,
  title,
  message
}) => {
  return (
    <div>
    </div>
  );
};