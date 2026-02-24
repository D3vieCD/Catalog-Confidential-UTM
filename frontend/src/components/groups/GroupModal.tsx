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
              className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto"
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
export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group,
}) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    year: 1,
    faculty: '',
    specialization: '',
    coordinator: '',
    maxCapacity: 30,
    semester: 'I',
    status: 'ACTIV',
    subjects: [],
  });

  const [faculties, setFaculties] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newFacultyInput, setNewFacultyInput] = useState('');
  const [newSpecInput, setNewSpecInput] = useState('');
  const [showNewFaculty, setShowNewFaculty] = useState(false);
  const [showNewSpec, setShowNewSpec] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
    useEffect(() => {
    setFaculties(getFaculties());
  }, []);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        year: group.year,
        faculty: group.faculty,
        specialization: group.specialization,
        coordinator: group.coordinator,
        maxCapacity: group.maxCapacity,
        semester: group.semester,
        status: group.status,
        subjects: group.subjects,
      });
      setSpecializations(getSpecializations(group.faculty));
    } else {
      setFormData({
        name: '',
        year: 1,
        faculty: '',
        specialization: '',
        coordinator: '',
        maxCapacity: 30,
        semester: 'I',
        status: 'ACTIV',
        subjects: [],
      });
      setSpecializations([]);
    }
    setErrors([]);
  }, [group, isOpen]);