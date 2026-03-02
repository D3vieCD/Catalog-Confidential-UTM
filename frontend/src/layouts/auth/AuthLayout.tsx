import { Navigate } from 'react-router-dom';
import { storage } from '../../utils';
import { paths } from '../../routes/paths';

interface AuthLayoutProps {
  children: React.ReactNode;
}