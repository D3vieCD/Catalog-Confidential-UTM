import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import useAdmin from '../../hooks/useAdmin';
import type { AdminGroupDto } from '../../context/AdminProvider';

const STATUS_BADGE: Record<string, string> = {
  activ:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  arhivat: 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400',
};

const avgColor = (avg: number) => {
  if (avg >= 8.5) return '#10b981';
  if (avg >= 7)   return '#f59e0b';
  return '#ef4444';
};

function useIsDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export const AdminGroups = () => {
  const { getAdminGroups, archiveAdminGroup, loading } = useAdmin();
  const [groups, setGroups] = useState<AdminGroupDto[]>([]);
  const [search, setSearch] = useState('');
  const isDark = useIsDark();

  useEffect(() => {
    getAdminGroups().then(setGroups).catch(() => {});
  }, []);

  const filtered = groups.filter((g) =>
    g.groupName.toLowerCase().includes(search.toLowerCase()) ||
    g.coordinator.toLowerCase().includes(search.toLowerCase()) ||
    g.faculty.toLowerCase().includes(search.toLowerCase())
  );

  const activeGroups = groups.filter((g) => !g.isArchived);

  const handleArchive = async (id: number) => {
    await archiveAdminGroup(id);
    setGroups((prev) =>
      prev.map((g) => g.id === id ? { ...g, isArchived: !g.isArchived } : g)
    );
  };

  const textColor   = isDark ? '#9ca3af' : '#6b7280';
  const gridColor   = isDark ? '#374151' : '#f3f4f6';
  const bgTooltip   = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  const studentsChart = useMemo<ApexOptions>(() => ({
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 600 },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '45%',
        distributed: false,
      },
    },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#60a5fa'],
        stops: [0, 100],
      },
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: activeGroups.map((g) => g.groupName),
      labels: { style: { colors: textColor, fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: textColor, fontSize: '11px' } },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
      y: { formatter: (val: number) => `${val} studenți` },
    },
    series: [{ name: 'Studenți', data: activeGroups.map((g) => g.studentCount) }],
  }), [activeGroups, isDark, textColor, gridColor]);

  const performanceChart = useMemo<ApexOptions>(() => {
    const withAvg = activeGroups.filter((g) => g.average > 0);
    return {
      chart: {
        type: 'bar',
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 600 },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1),
        style: { fontSize: '11px', fontWeight: 600, colors: ['#fff'] },
        offsetY: 6,
      },
      legend: { show: false },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          stops: [0, 90],
        },
      },
      colors: withAvg.map((g) => avgColor(g.average)),
      xaxis: {
        categories: withAvg.map((g) => g.groupName),
        labels: { style: { colors: textColor, fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 10,
        labels: { style: { colors: textColor, fontSize: '11px' } },
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: { fontSize: '12px' },
        y: { formatter: (val: number) => `${val.toFixed(2)} medie` },
      },
      series: [{ name: 'Medie', data: withAvg.map((g) => g.average) }],
    };
  }, [activeGroups, isDark, textColor, gridColor]);

  if (loading && groups.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="mr-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grupe</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {groups.length} grupe în sistem — {activeGroups.length} active
          </p>
        </div>
        <div className="flex-1 min-w-48">
          <input
            type="text"
            placeholder="Caută după grupă, coordonator sau facultate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grafice */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Studenți per grupă</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Număr studenți înregistrați (grupe active)</p>
          <ReactApexChart
            key={`students-${isDark}`}
            options={studentsChart}
            series={studentsChart.series}
            type="bar"
            height={220}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Performanță per grupă</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Medie generală —{' '}
            <span className="text-emerald-500">■</span> ≥8.5{' '}
            <span className="text-amber-500 ml-1">■</span> ≥7{' '}
            <span className="text-red-500 ml-1">■</span> &lt;7
          </p>
          <ReactApexChart
            key={`perf-${isDark}`}
            options={performanceChart}
            series={performanceChart.series}
            type="bar"
            height={220}
          />
        </motion.div>

      </div>

      {/* Tabel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-stone-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 dark:bg-gray-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grupă</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coordonator</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Facultate / An</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Studenți</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medie</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group, idx) => (
                <tr
                  key={group.id}
                  className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{group.groupName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{group.coordinator || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{group.faculty || '—'}</span>
                    {group.year > 0 && <span className="ml-2 text-xs text-gray-400">Anul {group.year}</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{group.studentCount}</td>
                  <td className="px-6 py-4">
                    {group.average > 0 ? (
                      <span className="text-sm font-semibold" style={{ color: avgColor(group.average) }}>
                        {group.average.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[group.isArchived ? 'arhivat' : 'activ']}`}>
                      {group.isArchived ? 'arhivat' : 'activ'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleArchive(group.id)}
                        title={group.isArchived ? 'Reactivează' : 'Arhivează'}
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${
                          !group.isArchived
                            ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        {!group.isArchived ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Nicio grupă găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
