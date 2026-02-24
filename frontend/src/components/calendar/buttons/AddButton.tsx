import React from 'react';

interface AddButtonProps {
  onClick?: () => void;
  label?: string;
}

/**
 * AddButton - Buton pentru adăugare evenimente în calendar
 * Poate fi folosit cu handler personalizat prin prop onClick
 */
export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  label = 'Adaugă'
}) => {
  if (!onClick) return null;

  return (
    <button
      onClick={onClick}
      className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2.5 overflow-hidden"
      aria-label="Adaugă eveniment"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
      </svg>
      <span className="relative z-10">{label}</span>
    </button>
  );
};