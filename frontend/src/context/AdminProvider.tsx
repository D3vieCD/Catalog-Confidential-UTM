import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface AdminUser {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdOn: string;
}

export interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalGroups: number;
    globalAverage: number;
}

export interface AdminActivity {
    id: number;
    action: string;
    target: string;
    timestamp: string;
    type: string;
}

export interface UserProfile {
    id: number;
    userName: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    bio: string | null;
}

export interface AdminStudentDto {
    id: number;
    fullName: string;
    email: string;
    groupName: string;
    faculty: string;
    year: number;
    average: number;
    absences: number;
}

export interface AdminGroupDto {
    id: number;
    groupName: string;
    coordinator: string;
    faculty: string;
    year: number;
    studentCount: number;
    average: number;
    absences: number;
    isArchived: boolean;
}

export interface AdminContextType {
    loading: boolean;
    error: string | null;
    getAllUsers: () => Promise<AdminUser[]>;
    deleteUser: (userId: number) => Promise<void>;
    updateUserRole: (userId: number, role: string) => Promise<void>;
    getAdminStats: () => Promise<AdminStats>;
    getAdminActivity: (userId?: number) => Promise<AdminActivity[]>;
    getAdminGroups: () => Promise<AdminGroupDto[]>;
    archiveAdminGroup: (groupId: number) => Promise<void>;
    getAdminStudents: () => Promise<AdminStudentDto[]>;
    getProfile: () => Promise<UserProfile>;
    updateProfile: (data: { firstName: string; lastName: string; phone?: string; bio?: string }) => Promise<void>;
    changePassword: (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
    resetUserData: (userId: number) => Promise<string>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getAllUsers(): Promise<AdminUser[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AdminUser[]>(`/user`);
            return data || [];
        } catch (err) {
            setError("Nu s-au putut încărca utilizatorii.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(userId: number): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/user/${userId}`);
        } catch (err) {
            setError("Nu s-a putut șterge utilizatorul.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateUserRole(userId: number, role: string): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`/user/${userId}/role`, { role });
        } catch (err) {
            setError("Nu s-a putut actualiza rolul.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAdminStats(): Promise<AdminStats> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AdminStats>('/admin/stats');
            return data;
        } catch (err) {
            setError("Nu s-au putut încărca statisticile.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAdminActivity(userId?: number): Promise<AdminActivity[]> {
        try {
            setLoading(true);
            setError(null);
            const url = userId ? `/admin/activity?userId=${userId}` : '/admin/activity';
            const { data } = await axios.get<AdminActivity[]>(url);
            return data || [];
        } catch (err) {
            setError("Nu s-a putut încărca activitatea.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getProfile(): Promise<UserProfile> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<UserProfile>('/auth/me');
            return data;
        } catch (err) {
            setError("Nu s-a putut încărca profilul.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(profileData: { firstName: string; lastName: string; phone?: string; bio?: string }): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put('/auth/profile', profileData);
        } catch (err) {
            setError("Nu s-a putut actualiza profilul.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function changePassword(passwordData: { oldPassword: string; newPassword: string; confirmPassword: string }): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put('/auth/change-password', passwordData);
        } catch (err) {
            setError("Nu s-a putut schimba parola.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function resetUserData(userId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<string>(`/admin/users/${userId}/data`);
            return data;
        } catch (err) {
            setError("Nu s-au putut reseta datele utilizatorului.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAdminGroups(): Promise<AdminGroupDto[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AdminGroupDto[]>('/admin/groups');
            return data || [];
        } catch (err) {
            setError("Nu s-au putut încărca grupele.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAdminStudents(): Promise<AdminStudentDto[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AdminStudentDto[]>('/admin/students');
            return data || [];
        } catch (err) {
            setError("Nu s-au putut încărca studenții.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function archiveAdminGroup(groupId: number): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`/admin/groups/${groupId}/archive`);
        } catch (err) {
            setError("Nu s-a putut actualiza statusul grupei.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminContext.Provider value={{ getAllUsers, deleteUser, updateUserRole, getAdminStats, getAdminActivity, getAdminGroups, archiveAdminGroup, getAdminStudents, getProfile, updateProfile, changePassword, resetUserData, loading, error }}>
            {children}
        </AdminContext.Provider>
    );
}
