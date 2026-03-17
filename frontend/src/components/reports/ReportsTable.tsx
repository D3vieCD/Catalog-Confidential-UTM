import { motion } from 'framer-motion';
import type { Report } from '../../_mock/mockReports';

interface ReportsTableProps {
  reports: Report[];
}

/**
 * ReportsTable - Tabel cu istoricul rapoartelor generate
 */
export const ReportsTable = ({ reports }: ReportsTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('ro-RO', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'note':
        return 'Note';
      case 'absente':
        return 'Absențe';
      case 'complet':
        return 'Complet';
    }
  };

  const handleDownload = (report: Report) => {
    alert(`Descărcare raport:\n\nGrupă: ${report.groupName}\nTip: ${getTypeLabel(report.type)}\nData: ${formatDate(report.date)}\n\nÎn producție, aici s-ar descărca fișierul Excel.`);
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Nu există rapoarte generate încă</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rapoarte Recente</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Grupă
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Tip
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {/* Data */}
                <td className="px-6 py-4">
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(report.date)}</p>
                </td>

                {/* Grupă */}
                <td className="px-6 py-4">
                  <p className="text-gray-900 dark:text-white font-semibold">{report.groupName}</p>
                </td>

                {/* Tip */}
                <td className="px-6 py-4">
                  <p className="text-gray-600 dark:text-gray-400">{getTypeLabel(report.type)}</p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    {report.status === 'generat' ? 'Generat' : 'Procesare'}
                  </span>
                </td>

                {/* Acțiuni */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownload(report)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    Descarcă din nou
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
