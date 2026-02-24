import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const defaultActions: QuickAction[] = [
    {
      id: 'add-grade',
      title: 'Adaugă Notă',
      description: 'Înregistrează note noi pentru studenți',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      route: '/catalog/add-grade'
    },