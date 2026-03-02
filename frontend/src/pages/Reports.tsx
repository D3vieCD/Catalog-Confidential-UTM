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