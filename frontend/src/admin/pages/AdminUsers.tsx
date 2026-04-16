import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ADMIN_USERS } from '../_mock/mockAdminData';
import type { AdminUser } from '../_mock/mockAdminData';
import { UserModal } from '../components/users/UserModal';

/**
 * AdminUsers - Gestionare utilizatori sistem
 */

type RoleFilter = 'toate' | 'admin' | 'profesor';
type StatusFilter = 'toate' | 'activ' | 'inactiv';

const ROLE_BADGE: Record<AdminUser['role'], string> = {
  admin:    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  profesor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
};

const STATUS_BADGE: Record<AdminUser['status'], string> = {
  activ:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  inactiv: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400',
};

export const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('toate');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('toate');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'toate' || u.role === roleFilter;
    const matchStatus = statusFilter === 'toate' || u.status === statusFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = (data: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      const newUser: AdminUser = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-',
      };
      setUsers((prev) => [...prev, newUser]);
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  };

  const handleResetPassword = (name: string) => {
    showToast(`Parolă resetată cu succes pentru ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Titlu + buton adaugă */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Utilizatori</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {users.length} utilizatori în sistem
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adaugă Profesor
        </button>
      </div>

      {/* Filtre */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-gray-700 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Caută după nume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
          <option value="toate">Toate rolurile</option>
          <option value="admin">Admin</option>
          <option value="profesor">Profesor</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
          <option value="toate">Toate statusurile</option>
          <option value="activ">Activ</option>
          <option value="inactiv">Inactiv</option>
        </select>
      </div>

      {/* Tabel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-stone-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 dark:bg-gray-700/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilizator</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ultimul login</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => (
                <tr key={user.id} className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        title="Editează"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.name)}
                        title="Resetează parola"
                        className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        title="Șterge"
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Niciun utilizator găsit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        user={editingUser}
      />

      {/* Toast notificare reset parolă */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-xl"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Parolă resetată</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast((t) => ({ ...t, visible: false }))}
              className="ml-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
