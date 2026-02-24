export const EXCEL_TEMPLATE_COLUMNS = [
  'Nume Complet',
  'Număr Matricol',
  'Email Instituțional',
  'Specializare'
];
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { EXCEL_TEMPLATE_COLUMNS } from '../../_mock/mockReports';

export const ImportSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
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
      {/* Restul structurii va fi adăugat în commit-urile următoare */}
    </motion.div>
  );
};
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Te rog selectează un fișier Excel (.xlsx sau .xls)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSelectFile = () => fileInputRef.current?.click();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    // Simulare procesare asincronă
    setTimeout(() => {
      alert(`Fișier "${selectedFile.name}" procesat cu succes!`);
      setIsProcessing(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };
  {/* Secțiunea de descărcare template și cerințe format */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">Cerințe format Excel:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
          {EXCEL_TEMPLATE_COLUMNS.map((col, index) => (
            <li key={index}>Coloana {String.fromCharCode(65 + index)}: {col}</li>
          ))}
        </ul>
      </div>