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
<div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
  <div className="relative group">
    {currentUser.avatar ? (
      <img
        src={currentUser.avatar}
        alt={currentUser.name}
        className="w-24 h-24 rounded-2xl object-cover shadow-lg"
      />
    ) : (
      <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
        {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>
    )}
    <input
      type="file"
      id="avatar-upload"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </div>
</div>
<SettingsInput
  label="Nume Complet"
  value={profile.name}
  onChange={(value) => setProfile({ ...profile, name: value })}
/>

<SettingsInput
  label="Adresă Email"
  value={profile.email}
  onChange={(value) => setProfile({ ...profile, email: value })}
  type="email"
/>

<SettingsInput
  label="Număr Telefon"
  value={profile.phone}
  onChange={(value) => setProfile({ ...profile, phone: value })}
  type="tel"
/>

<SettingsInput
  label="Rol / Ocupație"
  value={profile.role}
  onChange={(value) => setProfile({ ...profile, role: value })}
/>