interface PreferencesData {
  language: string;
  timezone: string;
}
interface SettingsPreferencesProps {
  preferences: PreferencesData;
  setPreferences: (preferences: PreferencesData) => void;
}