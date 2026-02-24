import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Group, GroupFormData } from '../../_mock/mockGroups';
import { getFaculties, addFaculty, getSpecializations, addSpecialization } from '../../_mock/mockGroups';
import { Modal } from '../ui/Modal';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GroupFormData) => void;
  group?: Group | null;
}

// Custom Dropdown Component
interface DropdownOption {
  value: string | number;
  label: string;
}
const CustomDropdown: React.FC<{
  value: string | number;
  onChange: (value: any) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, options, placeholder = 'Selectează', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-500'
        }`}
      >
        <span className={selectedOption ? '' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>