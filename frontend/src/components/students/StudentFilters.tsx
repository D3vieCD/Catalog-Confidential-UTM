import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  groups: string[];
}

interface DropdownOption {
  value: string;
  label: string;
}

export const StudentFilters: React.FC<StudentFiltersProps> = () => {
  return <div></div>;
};
const CustomDropdown: React.FC<{
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder: string;
}> = ({ options, value, onChange, icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)}>
        {selectedLabel}
      </button>
    </div>
  );
};
return (
  <div ref={ref} className="relative">
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm py-2.5 px-3 pr-8 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-full text-left"
    >
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="truncate">{selectedLabel}</span>
      <svg className={`w-4 h-4 text-gray-400 absolute right-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 mt-1.5 w-full min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="max-h-52 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 ${
                  value === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
export const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
  groups,
}) => {
  const groupOptions: DropdownOption[] = [
    { value: '', label: 'Toate Grupele' },
    ...groups.map(g => ({ value: g, label: g })),
  ];

  const yearOptions: DropdownOption[] = [
    { value: '', label: 'Toți Anii' },
    { value: '1', label: 'Anul 1' },
    { value: '2', label: 'Anul 2' },
    { value: '3', label: 'Anul 3' },
    { value: '4', label: 'Anul 4' },
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'az', label: 'Alfabetic' },
    { value: 'za', label: 'Z - A' },
    { value: 'newest', label: 'Cel mai recent' },
    { value: 'oldest', label: 'Cel mai vechi' },
  ];

  return <div></div>;
};