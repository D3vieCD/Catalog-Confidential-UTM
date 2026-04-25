import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Grade {
    id: number;
    studentId: number;
    subjectName: string;
    gradeValue: number;
    dateAwarded: string;
    evaluationId?: number;
}

export interface GradeActionResponse {
    isValid: boolean;
    message: string;
    grade?: Grade;
    grades?: Grade[];
}

export interface CreateGradeDto {
    studentId: number;
    subjectName: string;
    gradeValue: number;
    dateAwarded: string;
    evaluationId?: number;
}

export interface UpdateGradeDto {
    subjectName: string;
    gradeValue: number;
    dateAwarded: string;
    evaluationId?: number;
}

export interface GradesContextType {
    loading: boolean;
    error: string | null;
    createGrade: (gradeData: CreateGradeDto) => Promise<Grade>;
    updateGrade: (gradeId: number, gradeData: UpdateGradeDto) => Promise<string>;
    getAllGrades: () => Promise<Grade[]>;
    getGradeById: (gradeId: number) => Promise<Grade>;
    getGradesByStudentId: (studentId: number) => Promise<Grade[]>;
    deleteGrade: (gradeId: number) => Promise<string>;
}

export const GradesContext = createContext<GradesContextType | undefined>(undefined);

export function GradesProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createGrade(gradeData: CreateGradeDto): Promise<Grade> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post<GradeActionResponse>(`/grade`, gradeData);
            if (data.isValid) return data.grade as Grade;
            throw new Error("Failed to create grade.");
        } catch (err) {
            setError("Failed to create grade.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAllGrades(): Promise<Grade[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<GradeActionResponse>(`/grade/`);
            return data.grades || [];
        } catch (err) {
            setError("Failed to retrieve grades.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getGradeById(gradeId: number): Promise<Grade> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<GradeActionResponse>(`/grade/${gradeId}`);
            if (data.grade) return data.grade;
            throw new Error("Grade not found.");
        } catch (err) {
            setError("Failed to retrieve grade.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getGradesByStudentId(studentId: number): Promise<Grade[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<GradeActionResponse>(`/grade/student/${studentId}`);
            return data.grades || [];
        } catch (err) {
            setError("Failed to retrieve grades.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteGrade(gradeId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<GradeActionResponse>(`/grade/${gradeId}`);
            return data.message;
        } catch (err) {
            setError("Failed to delete grade.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateGrade(gradeId: number, gradeData: UpdateGradeDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<GradeActionResponse>(`/grade/${gradeId}`, gradeData);
            return data.message;
        } catch (err) {
            setError("Failed to update grade.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <GradesContext.Provider value={{ createGrade, deleteGrade, getAllGrades, updateGrade, getGradeById, getGradesByStudentId, loading, error }}>
            {children}
        </GradesContext.Provider>
    );
}
