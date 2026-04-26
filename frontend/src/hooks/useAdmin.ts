import { useContext } from 'react';
import { AdminContext } from '../context/AdminProvider';
export type { AdminUser } from '../context/AdminProvider';

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
