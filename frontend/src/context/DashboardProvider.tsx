import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface DashboardStats {
    totalStudents: number;
    totalGrades: number;
    averageGrade: number;
    totalAbsencesThisMonth: number;
}

export interface RecentActivity {
    id: number;
    studentName: string;
    action: string;
    details: string;
    time: string;
    type: 'grade' | 'absence' | 'other';
}

export interface DashboardActionResponse {
    isValid: boolean;
    message: string;
    stats?: DashboardStats;
    recentActivities?: RecentActivity[];
}

export interface DashboardContextType {
    loading: boolean;
    error: string | null;
    getDashboardStats: () => Promise<DashboardStats>;
    getRecentActivity: () => Promise<RecentActivity[]>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getDashboardStats(): Promise<DashboardStats> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<DashboardActionResponse>(`/dashboard/stats`);
            if (data.isValid && data.stats) return data.stats;
            throw new Error("Failed to retrieve dashboard stats.");
        } catch (err) {
            setError("Failed to retrieve dashboard stats.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getRecentActivity(): Promise<RecentActivity[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<DashboardActionResponse>(`/dashboard/recent-activity`);
            if (data.isValid && data.recentActivities) return data.recentActivities;
            return [];
        } catch (err) {
            setError("Failed to retrieve recent activity.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardContext.Provider value={{ getDashboardStats, getRecentActivity, loading, error }}>
            {children}
        </DashboardContext.Provider>
    );
}
