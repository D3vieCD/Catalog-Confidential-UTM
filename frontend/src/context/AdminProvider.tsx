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

export interface AdminContextType {
    loading: boolean;
    error: string | null;
    getAllUsers: () => Promise<AdminUser[]>;
    deleteUser: (userId: number) => Promise<void>;
    updateUserRole: (userId: number, role: string) => Promise<void>;
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

    return (
        <AdminContext.Provider value={{ getAllUsers, deleteUser, updateUserRole, loading, error }}>
            {children}
        </AdminContext.Provider>
    );
}
