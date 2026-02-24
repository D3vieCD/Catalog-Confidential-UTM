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
    const handleFacultyChange = (faculty: string) => {
    setFormData({ ...formData, faculty, specialization: '' });
    setSpecializations(getSpecializations(faculty));
  };

  const handleAddFaculty = () => {
    if (newFacultyInput.trim()) {
      const updated = addFaculty(newFacultyInput.trim());
      setFaculties(updated);
      handleFacultyChange(newFacultyInput.trim());
      setNewFacultyInput('');
      setShowNewFaculty(false);
    }
  };
    const handleAddSpecialization = () => {
    if (newSpecInput.trim() && formData.faculty) {
      const updated = addSpecialization(formData.faculty, newSpecInput.trim());
      setSpecializations(updated);
      setFormData({ ...formData, specialization: newSpecInput.trim() });
      setNewSpecInput('');
      setShowNewSpec(false);
    }
  };
    const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Numele grupei este obligatoriu');
    if (!formData.faculty) newErrors.push('Facultatea este obligatorie');
    if (!formData.specialization.trim()) newErrors.push('Specializarea este obligatorie');
    if (!formData.coordinator.trim()) newErrors.push('Coordinatorul este obligatoriu');
    if (formData.maxCapacity < 1) newErrors.push('Capacitatea trebuie să fie mai mare decât 0');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSave(formData);
  };
    return (
    <Modal isOpen={isOpen} onClose={onClose} title={group ? 'Editează Grupa' : 'Adaugă Grupă Nouă'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Scrollable content */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-5">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div className="space-y-1">
                {errors.map((error, idx) => (
                  <p key={idx} className="text-sm text-red-600 dark:text-red-400">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nume Grupă */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Nume Grupă *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: INF-211"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* An Studii */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              An Studii *
            </label>
            <CustomDropdown
              value={formData.year}
              onChange={(value) => setFormData({ ...formData, year: value as number })}
              options={[
                { value: 1, label: 'Anul 1' },
                { value: 2, label: 'Anul 2' },
                { value: 3, label: 'Anul 3' },
                { value: 4, label: 'Anul 4' },
              ]}
            />
          </div>
        </div>
                {/* Facultate cu inline add */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Facultate *
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomDropdown
                value={formData.faculty}
                onChange={handleFacultyChange}
                options={[
                  { value: '', label: 'Selectează facultatea' },
                  ...faculties.map(fac => ({ value: fac, label: fac }))
                ]}
                placeholder="Selectează facultatea"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNewFaculty(!showNewFaculty)}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
              title="Adaugă facultate nouă"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {showNewFaculty && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex gap-2"
              >
                <input
                  type="text"
                  value={newFacultyInput}
                  onChange={(e) => setNewFacultyInput(e.target.value)}
                  placeholder="Nume facultate nouă"
                  className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFaculty())}
                />
                <button
                  type="button"
                  onClick={handleAddFaculty}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Salvează
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>