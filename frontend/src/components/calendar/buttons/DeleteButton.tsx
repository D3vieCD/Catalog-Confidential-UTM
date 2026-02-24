import React from 'react';

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

/**
 * DeleteButton - Buton pentru ștergere evenimente în calendar
 * Poate fi folosit cu handler personalizat prin prop onClick
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  label = 'Ștergere',
  disabled = false
}) => {
  if (!onClick) return null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group px-6 py-3 border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2.5 ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
      }`}
      aria-label="Șterge eveniment"
    >
      <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
      <span>{label}</span>
    </button>
  );
};
