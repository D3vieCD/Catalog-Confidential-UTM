import React from 'react';
import { SettingsInput } from '../ui';
import { useAuth } from '../../../hooks/useAuth';

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

export const SettingsProfile: React.FC<SettingsProfileProps> = ({ profile, setProfile }) => {
  const { getUser, updateUser } = useAuth();
  const currentUser = getUser();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Actualizează imaginea în useAuth pentru a se reflecta peste tot
        updateUser({ ...currentUser, avatar: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="relative group">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
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
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:scale-110 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{profile.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsInput
          label="Nume Complet"
          value={profile.name}
          onChange={(value) => setProfile({ ...profile, name: value })}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          }
        />
        <SettingsInput
          label="Adresă Email"
          value={profile.email}
          onChange={(value) => setProfile({ ...profile, email: value })}
          type="email"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          }
        />
        <SettingsInput
          label="Număr Telefon"
          value={profile.phone}
          onChange={(value) => setProfile({ ...profile, phone: value })}
          type="tel"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          }
        />
        <SettingsInput
          label="Rol / Ocupație"
          value={profile.role}
          onChange={(value) => setProfile({ ...profile, role: value })}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Bio
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
};
