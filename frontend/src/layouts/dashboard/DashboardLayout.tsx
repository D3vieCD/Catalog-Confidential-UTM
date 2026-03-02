import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout - Layout principal pentru dashboard
 * Include Header fixed + Sidebar hover expand + Content alături
 */

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
      return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header - Fixed în top */}
      <Header />

      {/* Sidebar - Fixed în stânga */}
      <Sidebar />