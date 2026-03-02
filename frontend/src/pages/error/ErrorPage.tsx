import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  code: number;
  title: string;
  description: string;
  buttonText?: string;
  navigateTo: string;
}

export const ErrorPage = ({
  code,
  title,
  description,
  buttonText = 'Înapoi la Dashboard',
  navigateTo,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    try {
      navigate(navigateTo);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: încearcă să navigheze la login
      navigate('/login');
    }
  };
  const gradients: Record<number, string> = {
    403: 'from-orange-500 to-red-600',
    404: 'from-indigo-500 to-purple-600',
    500: 'from-red-500 to-pink-600',
  };

  const gradient = gradients[code] || 'from-indigo-500 to-purple-600';