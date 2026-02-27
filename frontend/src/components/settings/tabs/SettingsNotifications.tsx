interface NotificationsData {
  emailUpdates: boolean;
  pushNotifications: boolean;
  studentMessages: boolean;
  securityAlerts: boolean;
}
interface SettingsNotificationsProps {
  notifications: NotificationsData;
  setNotifications: (notifications: NotificationsData) => void;
}
import React from 'react';
import { SettingsToggle } from '../ui';

export const SettingsNotifications: React.FC<SettingsNotificationsProps> = ({
  notifications,
  setNotifications
}) => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
    </div>
  );
};
<SettingsToggle
  label="Email de actualizare"
  description="Primește email-uri despre activitatea din catalog."
  enabled={notifications.emailUpdates}
  onChange={(enabled) =>
    setNotifications({ ...notifications, emailUpdates: enabled })
  }
/>