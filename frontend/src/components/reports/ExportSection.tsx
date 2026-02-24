import { useState } from 'react';
import { motion } from 'framer-motion';
import { getGroups } from '../../_mock/mockGroups';
import { addReport, generateExcelData } from '../../_mock/mockReports';
import type { Report } from '../../_mock/mockReports';

interface ExportSectionProps {
  onReportGenerated: (report: Report) => void;
}

export const ExportSection = ({ onReportGenerated }: ExportSectionProps) => {
  const groups = getGroups();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [reportType, setReportType] = useState<'note' | 'absente' | 'complet'>('note');

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
      {/* ... restul codului de UI ... */}
    </motion.div>
  );
};