import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface Group {
    id: number;
    groupName: string; // ex: INF-211
    year: number; // 1-4
    faculty: string; // ex: Informatică
    specialization: string; // ex: Informatică Aplicată
    coordinator: string; // ex: Prof. Dr. Ion Popescu
    maxCapacity: number; // ex: 30
    currentCapacity: number; // număr actual de studenți
    semester: SemesterNumber; // 1 sau 2
    createdAt: string;
}

export interface GroupActionResponse {
    isValid: boolean;
    message: string;
    group?: Group;
    groups?: Group[];
}

export interface GroupsContextType {
    loading: boolean;
    error: string | null;
    createGroup: (groupData: CreateGroupDto) => Promise<Group>;
    updateGroup: (GroupId: number, groupData: UpdateGroupDto) => Promise<string>;
    getAllGroups: () => Promise<Group[]>;
    getGroupById: (GroupId: number) => Promise<Group>;
    deleteGroup: (GroupId: number) => Promise<string>;
}

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CreateGroupDto = {
    groupName: string;
    year: number;
    faculty: string;
    specialization: string;
    coordinator: string;
    maxCapacity: number;
    semester: SemesterNumber;
};

export type UpdateGroupDto = {
    groupName: string;
    year: number;
    faculty: string;
    specialization: string;
    coordinator: string;
    maxCapacity: number;
    semester: SemesterNumber;
};

export const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createGroup(groupData: CreateGroupDto): Promise<Group> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post<GroupActionResponse>(`/group`, groupData);
            if (data.isValid) return data.group as Group;
            throw new Error("Failed to create group.");
        } catch (err) {
            setError("Failed to create group.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getAllGroups(): Promise<Group[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<GroupActionResponse>(`/group/`);
            if (data.isValid) {
                console.log("Groups retrieved successfully.")
            }else {
                console.error("Failed to retrieve groups:", data.message);
            }
            return data.groups || [];
        } catch (err) {
            setError("Failed to retrieve badge templates.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getGroupById(GroupId: number): Promise<Group> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<GroupActionResponse>(`/group/${GroupId}`);
            if (data.group) return data.group;
            throw new Error("Group not found.");
        } catch (err) {
            setError("Failed to retrieve group.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteGroup(GroupId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<GroupActionResponse>(`/group/${GroupId}`);
            return data.message;
        } catch (err) {
            setError("Failed to delete group.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateGroup(GroupId: number, groupData: UpdateGroupDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<GroupActionResponse>(`/group/${GroupId}`, groupData);
            return data.message;
        } catch (err) {
            setError("Failed to update group.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <GroupsContext.Provider value={{ createGroup, deleteGroup, getAllGroups, updateGroup, getGroupById, loading, error }}>
            {children}
        </GroupsContext.Provider>
    )
}