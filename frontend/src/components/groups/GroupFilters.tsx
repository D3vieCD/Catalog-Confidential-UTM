import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

// Custom Dropdown Component (refolosit din StudentFilters)
interface DropdownOption {
  value: string;
  label: string;
}
const CustomDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  icon: React.ReactNode;
}> = ({ value, onChange, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]"
      >
        <span className="text-gray-400">{icon}</span>
        <span className="flex-1 text-left">{selectedOption.label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
            <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-20"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                    option.value === value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export const GroupFilters: React.FC<GroupFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
}) => {
  const yearOptions: DropdownOption[] = [
    { value: '', label: 'Toți Anii' },
    { value: '1', label: 'Anul 1' },
    { value: '2', label: 'Anul 2' },
    { value: '3', label: 'Anul 3' },
    { value: '4', label: 'Anul 4' },
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'az', label: 'Alfabetic' },
    { value: 'za', label: 'Invers Alfabetic' },
    { value: 'year-asc', label: 'An Crescător' },
    { value: 'year-desc', label: 'An Descrescător' },
    { value: 'capacity-asc', label: 'Capacitate Crescătoare' },
    { value: 'capacity-desc', label: 'Capacitate Descrescătoare' },
  ];