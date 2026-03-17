import { useState } from 'react';
import { motion } from 'framer-motion';
import { getGroups } from '../../_mock/mockGroups';
import { addReport, generateExcelData } from '../../_mock/mockReports';
import type { Report } from '../../_mock/mockReports';

interface ExportSectionProps {
  onReportGenerated: (report: Report) => void;
}

/**
 * ExportSection - Secțiune pentru exportul datelor în Excel
 */
export const ExportSection = ({ onReportGenerated }: ExportSectionProps) => {
  const groups = getGroups();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [reportType, setReportType] = useState<'note' | 'absente' | 'complet'>('note');

  const handleExport = () => {
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) return;

    // Generează datele pentru export
    const data = generateExcelData(selectedGroup, reportType);

    // Adaugă raport în istoric
    const report = addReport(selectedGroup, group.name, reportType);
    onReportGenerated(report);

    // În realitate aici ar fi logica pentru a genera fișierul Excel
    // Pentru moment doar simulăm exportul
    console.log('Exporting data:', data);
    alert(`Raport generat pentru ${group.name}!\nTip: ${reportType}\n\nÎn producție, aici s-ar descărca fișierul Excel.`);
  };

  const reportTypes = [
    { id: 'note' as const, label: 'Doar Note' },
    { id: 'absente' as const, label: 'Doar Absențe' },
    { id: 'complet' as const, label: 'Raport Complet (Note + Absențe)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Descarcă Raport</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Export date în format Excel</p>
        </div>
      </div>

      {/* Selectează Grupa */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Selectează Grupa
        </label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} - {group.specialization}
            </option>
          ))}
        </select>
      </div>

      {/* Tip Raport */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Tip Raport
        </label>
        <div className="space-y-2">
          {reportTypes.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <input
                type="radio"
                name="reportType"
                value={type.id}
                checked={reportType === type.id}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buton Export */}
      <button
        onClick={handleExport}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Descarcă Excel
      </button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-1000/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex gap-2">
          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-2">Informații despre raport:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
              <li>Fișierul va conține toate datele grupei selectate</li>
              <li>Formatat pentru deschidere în Excel sau Google Sheets</li>
              <li>Include statistici și grafice automate</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
