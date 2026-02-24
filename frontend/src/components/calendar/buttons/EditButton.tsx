import React from 'react';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

/**
 * EditButton - Buton pentru editare evenimente în calendar
 * Poate fi folosit cu handler personalizat prin prop onClick
 */
export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  label = 'Editare',
  disabled = false
}) => {
  if (!onClick) return null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group px-6 py-3 border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2.5 ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
      }`}
      aria-label="Editează eveniment"
    >
      <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
      <span>{label}</span>
    </button>
  );
};
