import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Absence {
    id: number;
    studentId: number;
    subjectName: string;
    date: string;
    isMotivated: boolean;
}

export interface AbsenceActionResponse {
    isValid: boolean;
    message: string;
    absence?: Absence;
    absences?: Absence[];
}

export interface CreateAbsenceDto {
    studentId: number;
    subjectName: string;
    date: string;
    isMotivated: boolean;
}

export interface UpdateAbsenceDto {
    subjectName: string;
    date: string;
    isMotivated: boolean;
}

export interface AbsencesContextType {
    loading: boolean;
    error: string | null;
    createAbsence: (absenceData: CreateAbsenceDto) => Promise<Absence>;
    updateAbsence: (absenceId: number, absenceData: UpdateAbsenceDto) => Promise<string>;
    getAllAbsences: () => Promise<Absence[]>;
    getAbsenceById: (absenceId: number) => Promise<Absence>;
    getAbsencesByStudentId: (studentId: number) => Promise<Absence[]>;
    deleteAbsence: (absenceId: number) => Promise<string>;
}

export const AbsencesContext = createContext<AbsencesContextType | undefined>(undefined);

export function AbsencesProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createAbsence(absenceData: CreateAbsenceDto): Promise<Absence> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post<AbsenceActionResponse>(`/absence`, absenceData);
            if (data.isValid) return data.absence as Absence;
            throw new Error("Failed to create absence.");
        } catch (err) {
            setError("Failed to create absence.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAllAbsences(): Promise<Absence[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AbsenceActionResponse>(`/absence/`);
            return data.absences || [];
        } catch (err) {
            setError("Failed to retrieve absences.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAbsenceById(absenceId: number): Promise<Absence> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AbsenceActionResponse>(`/absence/${absenceId}`);
            if (data.absence) return data.absence;
            throw new Error("Absence not found.");
        } catch (err) {
            setError("Failed to retrieve absence.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAbsencesByStudentId(studentId: number): Promise<Absence[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<AbsenceActionResponse>(`/absence/student/${studentId}`);
            return data.absences || [];
        } catch (err) {
            setError("Failed to retrieve absences.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteAbsence(absenceId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<AbsenceActionResponse>(`/absence/${absenceId}`);
            return data.message;
        } catch (err) {
            setError("Failed to delete absence.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateAbsence(absenceId: number, absenceData: UpdateAbsenceDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<AbsenceActionResponse>(`/absence/${absenceId}`, absenceData);
            return data.message;
        } catch (err) {
            setError("Failed to update absence.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AbsencesContext.Provider value={{ createAbsence, deleteAbsence, getAllAbsences, updateAbsence, getAbsenceById, getAbsencesByStudentId, loading, error }}>
            {children}
        </AbsencesContext.Provider>
    );
}
