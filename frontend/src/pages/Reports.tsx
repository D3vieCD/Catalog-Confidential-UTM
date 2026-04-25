import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReportStats, ExportSection, ImportSection, ReportsTable } from '../components/reports';
import useReports from '../hooks/useReports';
import type { ReportHistoryItem, ReportStats as StatsType } from '../context/ReportProvider';

export const Reports = () => {
  const { getReportHistory, getReportStats } = useReports();
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [stats, setStats] = useState<StatsType>({
    totalReports: 0,
    activeGroups: 0,
    exportsThisMonth: 0,
    monthlyImports: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [history, reportStats] = await Promise.all([
        getReportHistory(),
        getReportStats(),
      ]);
      setReports(history);
      setStats(reportStats);
    } catch {
    }
  };

  const handleReportGenerated = () => {
    loadData();
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

      {/* Export & Import Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExportSection onReportGenerated={handleReportGenerated} />
        <ImportSection onGroupCreated={handleReportGenerated} />
      </div>

      {/* Reports Table */}
      <ReportsTable reports={reports} />
    </div>
  );
};
