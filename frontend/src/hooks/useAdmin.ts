import { useContext } from 'react';
import { AdminContext } from '../context/AdminProvider';
export type { AdminUser, AdminStats, AdminActivity, AdminGroupDto, AdminStudentDto, UserProfile } from '../context/AdminProvider';

const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export { useAdmin };
export default useAdmin;
