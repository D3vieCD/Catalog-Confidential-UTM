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
import React from 'react';
import { SettingsInput } from '../ui';
import { useAuth } from '../../../hooks/useAuth';

export const SettingsProfile: React.FC<SettingsProfileProps> = ({ profile, setProfile }) => {
  const { getUser, updateUser } = useAuth();
  const currentUser = getUser();

  return (
    <div className="space-y-6">
    </div>
  );
};