import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';
// import type { Group, GroupFormData } from '../../_mock/mockGroups';
import { Modal } from '../ui/Modal';
import type { CreateGroupDto, Group, SemesterNumber } from '../../context/GroupProvider';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateGroupDto) => void;
  group?: Group | null;
  faculties?: string[];
  specsByFaculty?: Record<string, string[]>;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

const CustomDropdown: React.FC<{
  value: string | number;
  onChange: (value: any) => void;
  options: DropdownOption[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder = 'Selectează' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-sm"
      >
        <span className={selectedOption ? '' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
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
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${option.value === value
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

const inputCls = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-sm";
const labelCls = "block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide";

export const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, onSave, group }) => {
  const [formData, setFormData] = useState<CreateGroupDto>({
    groupName: '',
    year: 1,
    faculty: '',
    specialization: '',
    coordinator: '',
    maxCapacity: 30,
    semester: 1,
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (group) {
      setFormData({
        groupName: group.groupName,
        year: group.year,
        faculty: group.faculty,
        specialization: group.specialization,
        coordinator: group.coordinator,
        maxCapacity: group.maxCapacity,
        semester: group.semester
      });
    } else {
      setFormData({ groupName: '', year: 1, faculty: '', specialization: '', coordinator: '', maxCapacity: 30, semester: 1 });
    }
    setErrors([]);
  }, [group, isOpen]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.groupName.trim()) errs.push('Numele grupei este obligatoriu');
    if (!formData.faculty.trim()) errs.push('Facultatea este obligatorie');
    if (!formData.specialization.trim()) errs.push('Specializarea este obligatorie');
    if (!formData.coordinator.trim()) errs.push('Coordinatorul este obligatoriu');
    if (formData.maxCapacity < 1) errs.push('Capacitatea trebuie să fie mai mare decât 0');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const field = (key: keyof CreateGroupDto) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={group ? 'Editează Grupa' : 'Adaugă Grupă Nouă'} size="md">
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {errors.map((err, i) => <p key={i} className="text-xs text-red-600 dark:text-red-400">{err}</p>)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nume Grupă *</label>
            <input type="text" value={formData.groupName} onChange={field('groupName')} placeholder="ex: INF-211" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>An Studii *</label>
            <CustomDropdown
              value={formData.year}
              onChange={(v) => setFormData({ ...formData, year: v as number })}
              options={[1, 2, 3, 4].map(n => ({ value: n, label: `Anul ${n}` }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Facultate *</label>
            <input type="text" value={formData.faculty} onChange={field('faculty')} placeholder="ex: Informatică" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Specializare *</label>
            <input type="text" value={formData.specialization} onChange={field('specialization')} placeholder="ex: Inf. Aplicată" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Coordinator *</label>
          <input type="text" value={formData.coordinator} onChange={field('coordinator')} placeholder="ex: Prof. Dr. Ion Popescu" className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Capacitate Maximă *</label>
            <input
              type="number" value={formData.maxCapacity} min="1"
              onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Semestru *</label>
            <CustomDropdown
              value={formData.semester}
              onChange={(v) => setFormData({ ...formData, semester: v as SemesterNumber })}
              options={[
                { value: 1, label: 'Semestrul I' },
                { value: 2, label: 'Semestrul II' },
              ]}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors duration-200 text-sm">
            Anulează
          </button>
          <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
            {group ? 'Salvează' : 'Adaugă'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
