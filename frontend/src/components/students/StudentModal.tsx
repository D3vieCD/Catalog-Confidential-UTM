import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { Student, StudentFormData } from '../../_mock/mockStudents';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  student?: Student | null;
  groups: string[];
  onAddGroup: (group: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  groups,
  onAddGroup,
}) => {
  const isEdit = !!student;

  return <div />;
};
const [form, setForm] = useState<StudentFormData>({
  name: '',
  email: '',
  group: '',
  year: 1,
  status: 'active',
});

const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
const [showNewGroup, setShowNewGroup] = useState(false);
const [newGroupName, setNewGroupName] = useState('');
useEffect(() => {
  if (isOpen) {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        group: student.group,
        year: student.year,
        status: student.status,
      });
    } else {
      setForm({
        name: '',
        email: '',
        group: groups[0] || '',
        year: 1,
        status: 'active',
      });
    }
    setErrors({});
    setShowNewGroup(false);
    setNewGroupName('');
  }
}, [isOpen, student, groups]);
const validate = (): boolean => {
  const newErrors: { name?: string; email?: string } = {};
  if (!form.name.trim()) newErrors.name = 'Numele este obligatoriu';
  if (!form.email.trim()) {
    newErrors.email = 'Email-ul este obligatoriu';
  } else if (!form.email.includes('@')) {
    newErrors.email = 'Email-ul nu este valid';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  onSave(form);
};

const handleAddNewGroup = () => {
  const trimmed = newGroupName.trim().toUpperCase();
  if (trimmed) {
    onAddGroup(trimmed);
    setForm({ ...form, group: trimmed });
    setShowNewGroup(false);
    setNewGroupName('');
  }
};
const inputClasses = (hasError: boolean) =>
  `w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border ${
    hasError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
  } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`;

const labelClasses =
  'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';
return (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={isEdit ? 'Editează Student' : 'Adaugă Student Nou'}
    size="md"
    footer={
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-200"
        >
          Anulează
        </button>
        <button
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.email.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? 'Salvează' : 'Adaugă'}
        </button>
      </div>
    }
  >
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
      {isEdit ? 'Modifică detaliile studentului.' : 'Introdu detaliile studentului mai jos.'}
    </p>

    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className={labelClasses}>Nume Complet</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
          placeholder="ex: Ion Popescu"
          className={inputClasses(!!errors.name)}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={labelClasses}>Email Institutional</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
          placeholder="ex: student@stud.usm.md"
          className={inputClasses(!!errors.email)}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Group + Year Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Grupă
            </label>
            <button
              type="button"
              onClick={() => setShowNewGroup(!showNewGroup)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              NOUĂ
            </button>
          </div>

          {showNewGroup ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewGroup()}
                placeholder="ex: INF-311"
                autoFocus
                className={inputClasses(false)}
              />
              <button
                onClick={handleAddNewGroup}
                className="px-3 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              className={`${inputClasses(false)} cursor-pointer`}
            >
              {groups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className={labelClasses}>An Studii</label>
          <select
            value={form.year}
            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
            className={`${inputClasses(false)} cursor-pointer`}
          >
            <option value={1}>Anul 1</option>
            <option value={2}>Anul 2</option>
            <option value={3}>Anul 3</option>
            <option value={4}>Anul 4</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className={labelClasses}>Status Cont</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, status: 'active' })}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              form.status === 'active'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ACTIV
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, status: 'suspended' })}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              form.status === 'suspended'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            SUSPENDAT
          </button>
        </div>
      </div>
    </div>
  </Modal>
);