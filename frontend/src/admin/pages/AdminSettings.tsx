import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';
import type { UserProfile, AdminUser } from '../../hooks/useAdmin';

type Tab = 'profil' | 'parola' | 'export' | 'resetare';

const TABS: { key: Tab; label: string; icon: JSX.Element }[] = [
  {
    key: 'profil', label: 'Profil',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    key: 'parola', label: 'Securitate',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  },
  {
    key: 'export', label: 'Export',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  },
  {
    key: 'resetare', label: 'Resetare',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  },
];

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

function showToast(msg: string, ok = true) {
  const el = document.createElement('div');
  el.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium text-white ${ok ? 'bg-emerald-600' : 'bg-red-500'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

export const AdminSettings = () => {
  const { getProfile, updateProfile, changePassword, resetUserData, getAllUsers, getAdminGroups, getAdminStudents } = useAdmin();
  const [tab, setTab] = useState<Tab>('profil');

  // ── Profil ──────────────────────────────────────────────────────────────────
  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [bio,       setBio]       = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setFirstName(p.firstName ?? '');
      setLastName(p.lastName ?? '');
      setBio(p.bio ?? '');
    }).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, bio: bio || undefined });
      showToast('Profil actualizat cu succes!');
    } catch {
      showToast('Eroare la salvarea profilului.', false);
    } finally {
      setSaving(false);
    }
  };

  // ── Parolă ──────────────────────────────────────────────────────────────────
  const [oldPwd,  setOldPwd]  = useState('');
  const [newPwd,  setNewPwd]  = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  const handleChangePassword = async () => {
    setSavingPwd(true);
    try {
      await changePassword({ oldPassword: oldPwd, newPassword: newPwd, confirmPassword: confPwd });
      setOldPwd(''); setNewPwd(''); setConfPwd('');
      showToast('Parola a fost schimbată!');
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Eroare la schimbarea parolei.', false);
    } finally {
      setSavingPwd(false);
    }
  };

  // ── Export ───────────────────────────────────────────────────────────────────
  const downloadCsv = (rows: string[][], filename: string) => {
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
    URL.revokeObjectURL(url);
  };

  const handleExportUsers    = async () => { const d = await getAllUsers();       downloadCsv([['ID','Username','Prenume','Nume','Email','Rol','Creat la'], ...d.map(u => [String(u.id),u.userName,u.firstName,u.lastName,u.email,u.role,u.createdOn])], 'utilizatori.csv'); };
  const handleExportGroups   = async () => { const d = await getAdminGroups();   downloadCsv([['ID','Grupă','Coordonator','Facultate','An','Studenți','Medie','Absențe','Status'], ...d.map(g => [String(g.id),g.groupName,g.coordinator,g.faculty,String(g.year),String(g.studentCount),String(g.average),String(g.absences),g.isArchived?'arhivat':'activ'])], 'grupe.csv'); };
  const handleExportStudents = async () => { const d = await getAdminStudents(); downloadCsv([['ID','Nume','Email','Grupă','Facultate','An','Medie','Absențe'], ...d.map(s => [String(s.id),s.fullName,s.email,s.groupName,s.faculty,String(s.year),String(s.average),String(s.absences)])], 'studenti.csv'); };

  // ── Resetare ────────────────────────────────────────────────────────────────
  const [users,          setUsers]          = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [confirmReset,   setConfirmReset]   = useState(false);

  useEffect(() => {
    if (tab === 'resetare') getAllUsers().then(setUsers).catch(() => {});
  }, [tab]);

  const handleReset = async () => {
    if (!selectedUserId) return;
    try {
      const msg = await resetUserData(selectedUserId);
      showToast(msg);
      setConfirmReset(false);
      setSelectedUserId(null);
    } catch {
      showToast('Eroare la resetarea datelor.', false);
    }
  };

  const initials = profile
    ? (profile.firstName?.charAt(0) ?? profile.userName.charAt(0)).toUpperCase()
    : '?';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Setări</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestionează contul și datele sistemului</p>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar tabs ──────────────────────────────────────────────────── */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                tab === key
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-stone-100 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* Profil */}
            {tab === 'profil' && (
              <motion.div key="profil" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                {/* Avatar card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-gray-700 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {firstName || profile?.firstName} {lastName || profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">@{profile?.userName}</p>
                    <p className="text-xs text-gray-400">{profile?.email}</p>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    {profile?.role}
                  </span>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-4">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Informații personale</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Prenume" value={firstName} onChange={setFirstName} placeholder="Prenume" />
                    <InputField label="Nume"    value={lastName}  onChange={setLastName}  placeholder="Nume" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bio</label>
                    <textarea
                      value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                      placeholder="Scurtă descriere..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                      {saving ? 'Se salvează...' : 'Salvează modificările'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Securitate */}
            {tab === 'parola' && (
              <motion.div key="parola" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-5"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Schimbare parolă</h2>
                  <p className="text-xs text-gray-400 mt-1">Asigură-te că folosești o parolă puternică.</p>
                </div>
                <div className="space-y-4">
                  <InputField label="Parola curentă"    value={oldPwd}  onChange={setOldPwd}  type="password" />
                  <InputField label="Parola nouă"        value={newPwd}  onChange={setNewPwd}  type="password" />
                  <InputField label="Confirmă parola nouă" value={confPwd} onChange={setConfPwd} type="password" />
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleChangePassword} disabled={!oldPwd || !newPwd || !confPwd || savingPwd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                    {savingPwd ? 'Se salvează...' : 'Actualizează parola'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Export */}
            {tab === 'export' && (
              <motion.div key="export" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-5"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Export date sistem</h2>
                  <p className="text-xs text-gray-400 mt-1">Descarcă datele complete în format CSV.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Utilizatori',  sub: 'Toți utilizatorii înregistrați',  fn: handleExportUsers,    file: 'utilizatori.csv', color: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-100 dark:border-blue-800' },
                    { label: 'Grupe',        sub: 'Toate grupele cu statistici',      fn: handleExportGroups,   file: 'grupe.csv',       color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
                    { label: 'Studenți',     sub: 'Toți studenții cu medii',          fn: handleExportStudents, file: 'studenti.csv',    color: 'from-amber-500 to-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-100 dark:border-amber-800' },
                  ].map(({ label, sub, fn, color, bg, border }) => (
                    <div key={label} className={`flex items-center gap-4 p-4 rounded-xl border ${bg} ${border}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                      <button onClick={fn}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 rounded-xl text-xs font-medium transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarcă
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Resetare */}
            {tab === 'resetare' && (
              <motion.div key="resetare" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-5"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Resetare date utilizator</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Șterge toate grupele și studenții unui utilizator. Acțiunea este <span className="text-red-500 font-medium">ireversibilă</span>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Utilizator</label>
                  <select
                    value={selectedUserId ?? ''}
                    onChange={(e) => { setSelectedUserId(Number(e.target.value) || null); setConfirmReset(false); }}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-red-400 outline-none transition-all"
                  >
                    <option value="">— Alege utilizatorul —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName} (@{u.userName})</option>
                    ))}
                  </select>
                </div>

                {selectedUserId && !confirmReset && (
                  <button onClick={() => setConfirmReset(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Resetează datele
                  </button>
                )}

                <AnimatePresence>
                  {confirmReset && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          Ești sigur? Această acțiune va șterge permanent toate grupele și studenții utilizatorului selectat.
                        </p>
                      </div>
                      <div className="flex gap-3 pl-11">
                        <button onClick={handleReset}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                          Da, șterge tot
                        </button>
                        <button onClick={() => setConfirmReset(false)}
                          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors hover:bg-stone-50">
                          Anulează
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
