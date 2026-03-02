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