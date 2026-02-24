import React from 'react';

interface User {
  name: string;
  role: string;
  initials: string;
  avatar?: string | null;
}

interface WelcomeSectionProps {
  user: User;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'dimineața';
    if (hour < 18) return 'după-amiaza';
    return 'seara';
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('ro-RO', options);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            Bun venit, {user.name.split(' ')[1] || user.name}!
          </h1>
          <p className="text-blue-100 mb-4">
            Sperăm că aveți o zi productivă {getCurrentTime()}.
          </p>
          <p className="text-sm text-blue-200">
            {getCurrentDate()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-blue-100">Rol</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold">
                {user.initials}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
