import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface ReportHistoryItem {
    id: number;
    groupName: string;
    studentName: string | null;
    reportType: string;
    format: string;
    fileName: string;
    generatedAt: string;
}

export interface ReportStats {
    totalReports: number;
    activeGroups: number;
    exportsThisMonth: number;
    monthlyImports: number;
}

export interface ReportActionResponse {
    isValid: boolean;
    message: string;
    reports?: ReportHistoryItem[];
    stats?: {
        totalReports: number;
        activeGroups: number;
        exportsThisMonth: number;
        importsThisMonth: number;
    };
}

export type LogImportDto = {
    groupId: number;
    studentCount: number;
};

export type GenerateReportDto = {
    groupId: number;
    studentId?: number;
    reportType: string;
    format: string;
};

export interface ReportsContextType {
    loading: boolean;
    error: string | null;
    generateReport: (dto: GenerateReportDto) => Promise<void>;
    getReportHistory: () => Promise<ReportHistoryItem[]>;
    getReportStats: () => Promise<ReportStats>;
    downloadReport: (reportId: number) => Promise<void>;
    logImport: (dto: LogImportDto) => Promise<void>;
}

export const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const triggerDownload = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const extractFilename = (disposition: string, fallback: string): string => {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        return match ? match[1].replace(/['"]/g, '') : fallback;
    };

    async function generateReport(dto: GenerateReportDto): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/report/generate', dto, { responseType: 'blob' });
            const filename = extractFilename(response.headers['content-disposition'] || '', 'raport.xlsx');
            triggerDownload(response.data, filename);
        } catch (err) {
            setError("Failed to generate report.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getReportHistory(): Promise<ReportHistoryItem[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<ReportActionResponse>('/report');
            return data.reports || [];
        } catch (err) {
            setError("Failed to retrieve report history.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getReportStats(): Promise<ReportStats> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<ReportActionResponse>('/report/stats');
            return {
                totalReports: data.stats?.totalReports ?? 0,
                activeGroups: data.stats?.activeGroups ?? 0,
                exportsThisMonth: data.stats?.exportsThisMonth ?? 0,
                monthlyImports: data.stats?.importsThisMonth ?? 0,
            };
        } catch (err) {
            setError("Failed to retrieve report stats.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function downloadReport(reportId: number): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/report/${reportId}/download`, { responseType: 'blob' });
            const filename = extractFilename(response.headers['content-disposition'] || '', 'raport.xlsx');
            triggerDownload(response.data, filename);
        } catch (err) {
            setError("Failed to download report.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function logImport(dto: LogImportDto): Promise<void> {
        try {
            await axios.post('/report/log-import', dto);
        } catch {
            // non-critical — don't block the import flow
        }
    }

    return (
        <ReportsContext.Provider value={{ generateReport, getReportHistory, getReportStats, downloadReport, logImport, loading, error }}>
            {children}
        </ReportsContext.Provider>
    );
}
