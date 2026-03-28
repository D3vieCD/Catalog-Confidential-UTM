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
    console.log('Navigating to:', navigateTo);
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
    404: 'from-emerald-500 to-emerald-600',
    500: 'from-red-500 to-pink-600',
  };

  const gradient = gradients[code] || 'from-emerald-500 to-emerald-600';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-4 sm:mb-6`}
        >
          {code}
        </motion.div>

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
          {description}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigate}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r ${gradient} text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base`}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </div>
  );
};
