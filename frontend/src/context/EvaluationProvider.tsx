import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Evaluation {
    id: number;
    subjectId: number;
    name: string;
    type: string;
    date: string;
}

export interface EvaluationActionResponse {
    isValid: boolean;
    message: string;
    evaluation?: Evaluation;
    evaluations?: Evaluation[];
}

export interface CreateEvaluationDto {
    subjectId: number;
    name: string;
    type: string;
    date: string;
}

export interface UpdateEvaluationDto {
    name: string;
    type: string;
    date: string;
}

export interface EvaluationsContextType {
    loading: boolean;
    error: string | null;
    createEvaluation: (data: CreateEvaluationDto) => Promise<Evaluation>;
    getEvaluationsBySubjectId: (subjectId: number) => Promise<Evaluation[]>;
    updateEvaluation: (id: number, data: UpdateEvaluationDto) => Promise<Evaluation>;
    deleteEvaluation: (id: number) => Promise<string>;
}

export const EvaluationsContext = createContext<EvaluationsContextType | undefined>(undefined);

export function EvaluationsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createEvaluation(data: CreateEvaluationDto): Promise<Evaluation> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.post<EvaluationActionResponse>(`/evaluation`, data);
            if (res.isValid) return res.evaluation as Evaluation;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to create evaluation.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getEvaluationsBySubjectId(subjectId: number): Promise<Evaluation[]> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.get<EvaluationActionResponse>(`/evaluation/subject/${subjectId}`);
            return res.evaluations || [];
        } catch (err) {
            setError("Failed to retrieve evaluations.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateEvaluation(id: number, data: UpdateEvaluationDto): Promise<Evaluation> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.put<EvaluationActionResponse>(`/evaluation/${id}`, data);
            if (res.isValid) return res.evaluation as Evaluation;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to update evaluation.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteEvaluation(id: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.delete<EvaluationActionResponse>(`/evaluation/${id}`);
            return res.message;
        } catch (err) {
            setError("Failed to delete evaluation.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <EvaluationsContext.Provider value={{ createEvaluation, getEvaluationsBySubjectId, updateEvaluation, deleteEvaluation, loading, error }}>
            {children}
        </EvaluationsContext.Provider>
    );
}
