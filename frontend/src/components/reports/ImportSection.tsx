import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect } from '../ui/CustomSelect';
import * as XLSX from 'xlsx';
import { addStudent, addGroup as addGroupToStudents } from '../../_mock/mockStudents';
import { addGroup as addGroupToGroups } from '../../_mock/mockGroups';

interface ParsedStudent {
  name: string;
  email: string;
  phone: string;
  valid: boolean;
  error?: string;
}

type Step = 'upload' | 'preview' | 'done';

/**
 * ImportSection - Încarcă fișier Excel/CSV și creează automat o grupă cu studenții
 * Coloane așteptate: Nume, Prenume, Email, Telefon
 */
export const ImportSection = () => {
  const [step, setStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [students, setStudents] = useState<ParsedStudent[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupYear, setGroupYear] = useState<number>(1);
  const [subjectsInput, setSubjectsInput] = useState('Materie generală');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length < 2) {
          alert('Fișierul este gol sau nu are date.');
          return;
        }

        // Ignorăm primul rând (header)
        const parsed: ParsedStudent[] = rows.slice(1)
          .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
          .map((row) => {
            const nume = String(row[0] || '').trim();
            const prenume = String(row[1] || '').trim();
            const email = String(row[2] || '').trim();
            const phone = String(row[3] || '').trim();
            const fullName = `${prenume} ${nume}`.trim();

            if (!fullName || fullName === '') {
              return { name: '', email, phone, valid: false, error: 'Nume lipsă' };
            }
            if (!email || !email.includes('@')) {
              return { name: fullName, email, phone, valid: false, error: 'Email invalid' };
            }
            return { name: fullName, email, phone, valid: true };
          });

        setStudents(parsed);
        setStep('preview');
      } catch {
        alert('Eroare la citirea fișierului. Asigură-te că este un fișier Excel valid.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('Te rog selectează un fișier Excel (.xlsx, .xls) sau CSV (.csv)');
      return;
    }
    setSelectedFile(file);
    parseFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    parseFile(file);
  };

  const handleImport = async () => {
    if (!groupName.trim()) {
      alert('Te rog introdu numele grupei!');
      return;
    }
    const validStudents = students.filter((s) => s.valid);
    if (validStudents.length === 0) {
      alert('Nu există studenți valizi de importat.');
      return;
    }

    setIsProcessing(true);
    const name = groupName.trim().toUpperCase();

    // Creează grupa în ambele store-uri
    addGroupToStudents(name);
    const subjects = subjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    addGroupToGroups({
      name,
      year: groupYear,
      faculty: 'Informatică',
      specialization: 'Informatică Aplicată',
      coordinator: 'Nespecificat',
      maxCapacity: Math.max(validStudents.length, 30),
      semester: 'I',
      status: 'ACTIV',
      subjects,
    });

    // Adaugă fiecare student
    let count = 0;
    for (const s of validStudents) {
      addStudent({
        name: s.name,
        email: s.email,
        group: name,
        year: groupYear,
        status: 'active',
      });
      count++;
      // Mică pauză pentru a evita id-uri duplicate (Date.now())
      await new Promise((r) => setTimeout(r, 2));
    }

    setCreatedCount(count);
    setIsProcessing(false);
    setStep('done');
  };

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setStudents([]);
    setGroupName('');
    setGroupYear(1);
    setSubjectsInput('Materie generală');
    setCreatedCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Nume', 'Prenume', 'Email', 'Telefon'],
      ['Popescu', 'Ion', 'ion.popescu@stud.usm.md', '0712345678'],
      ['Ionescu', 'Maria', 'maria.ionescu@stud.usm.md', '0798765432'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Studenți');
    XLSX.writeFile(wb, 'template_studenti.xlsx');
  };

  const validCount = students.filter((s) => s.valid).length;
  const invalidCount = students.filter((s) => !s.valid).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/30 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Încarcă Listă Studenți</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Import Excel → creare automată grupă</p>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Trage fișierul aici sau apasă</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Excel (.xlsx, .xls) sau CSV</p>
                </div>
                <span className="px-5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors text-sm">
                  Selectează fișier
                </span>
              </div>
            </div>

            {/* Info + Download template */}
            <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header info */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Format așteptat — prima linie este header
                </p>
              </div>

              {/* Coloane */}
              <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
                {[
                  { col: 'A', label: 'Nume', eg: 'Popescu' },
                  { col: 'B', label: 'Prenume', eg: 'Ion' },
                  { col: 'C', label: 'Email', eg: 'ion@stud.ro' },
                  { col: 'D', label: 'Telefon', eg: '0712345678' },
                ].map(({ col, label, eg }) => (
                  <div key={col} className="px-3 py-3 text-center">
                    <span className="inline-block w-6 h-6 mb-1 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold leading-6">
                      {col}
                    </span>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{eg}</p>
                  </div>
                ))}
              </div>

              {/* Download button */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nu ai un fișier pregătit? Descarcă un exemplu gata completat.
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownloadTemplate(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Descarcă exemplu
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Preview + grup */}
        {step === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {/* Fișier selectat */}
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">{selectedFile?.name}</span>
              </div>
              <div className="flex gap-3 text-xs font-medium">
                <span className="text-green-600 dark:text-green-400">{validCount} valizi</span>
                {invalidCount > 0 && <span className="text-red-500">{invalidCount} erori</span>}
              </div>
            </div>

            {/* Preview tabel */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="max-h-52 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">#</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Nume complet</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Email</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Telefon</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {students.map((s, i) => (
                      <tr key={i} className={s.valid ? '' : 'bg-red-50 dark:bg-red-900/10'}>
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{s.name || '—'}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{s.email || '—'}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{s.phone || '—'}</td>
                        <td className="px-3 py-2">
                          {s.valid
                            ? <span className="text-green-600 dark:text-green-400 text-xs font-medium">✓ OK</span>
                            : <span className="text-red-500 text-xs font-medium">✕ {s.error}</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Setări grupă */}
            <div className="grid grid-cols-2 gap-3 mb-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nume grupă <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="ex: INF-214"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">An de studiu</label>
                <CustomSelect
                  value={String(groupYear)}
                  onChange={(v) => setGroupYear(Number(v))}
                  options={[1, 2, 3, 4].map(y => ({ value: String(y), label: `Anul ${y}` }))}
                />
              </div>
            </div>

            {/* Materii */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Materii <span className="text-gray-400 font-normal">(separate prin virgulă)</span>
              </label>
              <input
                type="text"
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="ex: Matematică, Informatică"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Butoane */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                ← Înapoi
              </button>
              <button
                onClick={handleImport}
                disabled={isProcessing || !groupName.trim() || validCount === 0}
                className="flex-[2] px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Se importă...
                  </>
                ) : (
                  `Importă ${validCount} studenți → ${groupName.trim().toUpperCase() || 'grupă'}`
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Done */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 gap-4 text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Import reușit!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Grupa <span className="font-semibold text-green-600 dark:text-green-400">{groupName.toUpperCase()}</span> a fost creată cu{' '}
                <span className="font-semibold">{createdCount} studenți</span>.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors text-sm"
            >
              Importă altă listă
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};
