import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { EXCEL_TEMPLATE_COLUMNS } from '../../_mock/mockReports';

/**
 * ImportSection - Secțiune pentru importul datelor din Excel
 */
export const ImportSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verifică dacă e fișier Excel
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Te rog selectează un fișier Excel (.xlsx sau .xls)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleProcessFile = async () => {
    if (!selectedFile) {
      alert('Te rog selectează un fișier mai întâi!');
      return;
    }

    setIsProcessing(true);

    // Simulare procesare fișier
    setTimeout(() => {
      alert(`Fișier "${selectedFile.name}" procesat cu succes!\n\nÎn producție, aici s-ar crea grupa cu studenții din Excel.`);
      setIsProcessing(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    alert('Descărcare template Excel...\n\nÎn producție, aici s-ar descărca un fișier Excel template.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/30 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Încarcă Date</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Import Excel pentru creare grupă</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            {selectedFile ? (
              <div>
                <p className="text-green-600 dark:text-green- font-semibold mb-1">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Încarcă fișier Excel</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Apasă sau trage fișierul aici</p>
              </div>
            )}

            <button
              onClick={handleSelectFile}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
            >
              Selectează fișier
            </button>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcessFile}
        disabled={!selectedFile || isProcessing}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Procesare...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Procesează și Creează Grupă
          </>
        )}
      </button>

      {/* Template Download */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <p className="text-purple-900 dark:text-purple-100 font-semibold mb-2">
          Nu ai un template Excel?
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
        >
          Descarcă template Excel exemplu
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
          Cerințe format Excel:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
          {EXCEL_TEMPLATE_COLUMNS.map((col, index) => (
            <li key={index}>Coloana {String.fromCharCode(65 + index)}: {col}</li>
          ))}
          <li>Prima linie = header (va fi ignorată)</li>
        </ul>
      </div>
    </motion.div>
  );
};
