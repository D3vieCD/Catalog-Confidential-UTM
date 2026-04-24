import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import type { UIStudent, StudentFormData } from '../../context/StudentProvider';
import type { Group } from '../../context/GroupProvider';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  student?: UIStudent | null;
  groups: Group[];
}

const GroupDropdown: React.FC<{
  value: string;
  groups: Group[];
  onChange: (groupName: string, year: number) => void;
  inputCls: string;
}> = ({ value, groups, onChange, inputCls }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`${inputCls} flex items-center justify-between cursor-pointer`}
      >
        <span>{value || 'Selectează grupa'}</span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {groups.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Nu există grupe disponibile</p>
          )}
          {groups.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => { onChange(g.groupName, g.year); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
                g.groupName === value
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {g.groupName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  groups,
}) => {
  const isEdit = !!student;

  const [form, setForm] = useState<StudentFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    group: '',
    year: 1,
    status: 'active',
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setForm({
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber,
          group: student.group,
          year: student.year,
          status: student.status,
        });
      } else {
        const firstGroup = groups[0];
        setForm({
          name: '',
          email: '',
          phoneNumber: '',
          group: firstGroup?.groupName ?? '',
          year: firstGroup?.year ?? 1,
          status: 'active',
        });
      }
      setErrors({});
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

  const inputCls = (hasError = false) =>
    `w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border ${
      hasError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
    } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`;

  const labelCls = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

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
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <label className={labelCls}>Nume Complet</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
            placeholder="ex: Ion Popescu"
            className={inputCls(!!errors.name)}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email Institutional</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
            placeholder="ex: student@stud.usm.md"
            className={inputCls(!!errors.email)}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Telefon</label>
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            placeholder="ex: 0712345678"
            className={inputCls(false)}
          />
        </div>

        {/* Group + Year Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Group */}
          <div>
            <label className={labelCls}>Grupă</label>
            <GroupDropdown
              value={form.group}
              groups={groups}
              onChange={(groupName, year) => setForm({ ...form, group: groupName, year })}
              inputCls={inputCls(false)}
            />
          </div>

          {/* Year — auto from group */}
          <div>
            <label className={labelCls}>An Studii</label>
            <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm text-gray-600 dark:text-gray-300 select-none">
              {form.year ? `Anul ${form.year}` : '—'}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
