import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReportStats, ExportSection, ImportSection, ReportsTable } from '../components/reports';
import { getReports, getReportStats } from '../_mock/mockReports';
import type { Report } from '../_mock/mockReports';

/**
 * Reports - Pagina de management rapoarte
 * Permite export/import Excel pentru note și absențe
 */
export const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState(getReportStats());

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports = getReports();
    setReports(allReports);
    setStats(getReportStats());
  };

  const handleReportGenerated = () => {
    // Refresh datele după ce s-a generat un raport nou
    loadReports();
  };
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Rapoarte
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Generează și descarcă rapoarte Excel pentru note și absențe, sau încarcă date pentru a crea grupe
        </p>
      </motion.div>

      {/* Stats Cards */}
      <ReportStats stats={stats} />