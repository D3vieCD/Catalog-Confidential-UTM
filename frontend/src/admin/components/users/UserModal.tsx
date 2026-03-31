import { useState, useEffect } from 'react';
import type { AdminUser } from '../../_mock/mockAdminData';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  user?: AdminUser | null;
}

const EMPTY_FORM = { name: '', email: '', role: 'profesor' as AdminUser['role'], status: 'activ' as AdminUser['status'] };

/**
 * UserModal - Modal adăugare/editare utilizator
 */
export const UserModal = ({ isOpen, onClose, onSave, user }: UserModalProps) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [user, isOpen]);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Numele și email-ul sunt obligatorii!');
      return;
    }
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user ? 'Editează Utilizator' : 'Adaugă Utilizator'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nume complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ion Popescu"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="profesor@scoala.ro"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser['role'] })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as AdminUser['status'] })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="activ">Activ</option>
                <option value="inactiv">Inactiv</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            {user ? 'Salvează' : 'Adaugă'}
          </button>
        </div>
      </div>
    </div>
  );
};
