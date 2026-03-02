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