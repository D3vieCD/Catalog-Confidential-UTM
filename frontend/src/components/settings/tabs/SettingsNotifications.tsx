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