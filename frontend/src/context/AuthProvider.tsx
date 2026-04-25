import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { storage } from "../utils";

export interface AuthUser {
    userId: number;
    userName: string;
    email: string;
    role: string;
}

export interface RegisterData {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthContextType {
    loading: boolean;
    error: string | null;
    login: (credential: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
    getUser: () => { name: string; email: string; role: string; avatar: string };
    updateUser: (userData: { name?: string; email?: string; role?: string; avatar?: string }) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function login(credential: string, password: string): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/auth/login', { credential, password });

            storage.set('isLoggedIn', 'true');
            storage.set('authToken', data.token);
            storage.set('userId', String(data.userId));
            storage.set('userName', data.userName);
            storage.set('userEmail', data.email);
            storage.set('userRole', data.role);
            storage.set('showAnimation', 'true');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Autentificare eșuată.';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    async function register(data: RegisterData): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.post('/auth/register', data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Înregistrare eșuată.';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    function logout(): void {
        storage.clear();
        window.location.href = '/login';
    }

    function isAuthenticated(): boolean {
        return storage.get('isLoggedIn') === 'true';
    }

    function getUser() {
        return {
            name: storage.get('userName') || '',
            email: storage.get('userEmail') || '',
            role: storage.get('userRole') || '',
            avatar: storage.get('userAvatar') || '',
        };
    }

    function updateUser(userData: { name?: string; email?: string; role?: string; avatar?: string }) {
        if (userData.name) storage.set('userName', userData.name);
        if (userData.email) storage.set('userEmail', userData.email);
        if (userData.role) storage.set('userRole', userData.role);
        if (userData.avatar !== undefined) storage.set('userAvatar', userData.avatar);
    }

    return (
        <AuthContext.Provider value={{ loading, error, login, register, logout, isAuthenticated, getUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
