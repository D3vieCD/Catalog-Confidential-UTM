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
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      updateUser({ ...currentUser, avatar: imageUrl });
    };
    reader.readAsDataURL(file);
  }
};