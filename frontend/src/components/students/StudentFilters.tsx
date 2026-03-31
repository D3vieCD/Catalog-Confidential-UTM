import { useState } from 'react';
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

const CustomDropdown: React.FC<{
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder: string;
}> = ({ options, value, onChange, icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm py-2.5 px-3 pr-8 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-blue-400 transition-all duration-200 w-full text-left"
      >
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        <span className="truncate">{selectedLabel}</span>
        <svg className={`w-4 h-4 text-gray-400 absolute right-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Caută după nume sau email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-blue-400 transition-all duration-200"
          />
        </div>

        {/* Custom Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          <CustomDropdown
            options={groupOptions}
            value={selectedGroup}
            onChange={onGroupChange}
            placeholder="Toate Grupele"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
            }
          />
          <CustomDropdown
            options={yearOptions}
            value={selectedYear}
            onChange={onYearChange}
            placeholder="Toți Anii"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            }
          />
          <CustomDropdown
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Alfabetic"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
            }
          />
        </div>
      </div>
    </motion.div>
  );
};
