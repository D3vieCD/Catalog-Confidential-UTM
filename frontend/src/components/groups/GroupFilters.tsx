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