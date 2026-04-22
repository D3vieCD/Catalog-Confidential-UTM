import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Subject {
    id: number;
    groupId: number;
    subjectName: string;
}

export interface SubjectActionResponse {
    isValid: boolean;
    message: string;
    subject?: Subject;
    subjects?: Subject[];
}

export interface CreateSubjectDto {
    groupId: number;
    subjectName: string;
}

export interface SubjectsContextType {
    loading: boolean;
    error: string | null;
    createSubject: (data: CreateSubjectDto) => Promise<Subject>;
    getSubjectsByGroupId: (groupId: number) => Promise<Subject[]>;
    deleteSubject: (subjectId: number) => Promise<string>;
}

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createSubject(data: CreateSubjectDto): Promise<Subject> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.post<SubjectActionResponse>(`/subject`, data);
            if (res.isValid) return res.subject as Subject;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to create subject.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getSubjectsByGroupId(groupId: number): Promise<Subject[]> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.get<SubjectActionResponse>(`/subject/group/${groupId}`);
            return res.subjects || [];
        } catch (err) {
            setError("Failed to retrieve subjects.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteSubject(subjectId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.delete<SubjectActionResponse>(`/subject/${subjectId}`);
            return res.message;
        } catch (err) {
            setError("Failed to delete subject.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <SubjectsContext.Provider value={{ createSubject, getSubjectsByGroupId, deleteSubject, loading, error }}>
            {children}
        </SubjectsContext.Provider>
    );
}
