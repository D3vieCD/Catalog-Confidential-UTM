interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
}
interface SettingsProfileProps {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
}