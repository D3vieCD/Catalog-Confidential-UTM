import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Student {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdOn: string;
    groupId: number;
}

export interface UIStudent {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    group: string;
    year: number;
    status: 'active' | 'suspended';
    createdAt: string;
    groupId: number;
}

export interface StudentFormData {
    name: string;
    email: string;
    phoneNumber: string;
    group: string;
    year: number;
    status: 'active' | 'suspended';
}

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('');
};

export interface StudentActionResponse {
    isValid: boolean;
    message: string;
    student?: Student;
    students?: Student[];
}

export interface StudentsContextType {
    loading: boolean;
    error: string | null;
    createStudent: (studentData: CreateStudentDto) => Promise<Student>;
    updateStudent: (studentId: number, studentData: UpdateStudentDto) => Promise<string>;
    getAllStudents: () => Promise<Student[]>;
    getStudentById: (studentId: number) => Promise<Student>;
    deleteStudent: (studentId: number) => Promise<string>;
}

export type CreateStudentDto = {
    fullName: string;
    email: string;
    phoneNumber: string;
    groupId: number;
};

export type UpdateStudentDto = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

export const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export function StudentsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createStudent(studentData: CreateStudentDto): Promise<Student> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post<StudentActionResponse>(`/student`, studentData);
            if (data.isValid) return data.student as Student;
            throw new Error("Failed to create student.");
        } catch (err) {
            setError("Failed to create student.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAllStudents(): Promise<Student[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<StudentActionResponse>(`/student/`);
            if (data.isValid) {
                console.log("Students retrieved successfully.");
            } else {
                console.error("Failed to retrieve students:", data.message);
            }
            return data.students || [];
        } catch (err) {
            setError("Failed to retrieve students.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getStudentById(studentId: number): Promise<Student> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<StudentActionResponse>(`/student/${studentId}`);
            if (data.student) return data.student;
            throw new Error("Student not found.");
        } catch (err) {
            setError("Failed to retrieve student.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteStudent(studentId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<StudentActionResponse>(`/student/${studentId}`);
            return data.message;
        } catch (err) {
            setError("Failed to delete student.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateStudent(studentId: number, studentData: UpdateStudentDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<StudentActionResponse>(`/student/${studentId}`, studentData);
            return data.message;
        } catch (err) {
            setError("Failed to update student.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <StudentsContext.Provider value={{ createStudent, deleteStudent, getAllStudents, updateStudent, getStudentById, loading, error }}>
            {children}
        </StudentsContext.Provider>
    );
}
