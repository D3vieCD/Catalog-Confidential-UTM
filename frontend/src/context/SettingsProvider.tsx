import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface SettingsProfile {
    userName: string;
    email: string;
    phone: string | null;
    bio: string | null;
    role: string;
    avatar: string | null;
}

export interface UpdateProfileDto {
    userName: string;
    phone: string | null;
    bio: string | null;
    avatar: string | null;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface SettingsActionResponse {
    isValid: boolean;
    message: string;
    profile?: SettingsProfile;
}

export interface SettingsContextType {
    loading: boolean;
    error: string | null;
    getProfile: () => Promise<SettingsProfile>;
    updateProfile: (dto: UpdateProfileDto) => Promise<string>;
    changePassword: (dto: ChangePasswordDto) => Promise<string>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getProfile(): Promise<SettingsProfile> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<SettingsActionResponse>('/settings/profile');
            return data.profile!;
        } catch (err) {
            setError("Failed to retrieve profile.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(dto: UpdateProfileDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<SettingsActionResponse>('/settings/profile', dto);
            return data.message;
        } catch (err) {
            setError("Failed to update profile.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function changePassword(dto: ChangePasswordDto): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put<SettingsActionResponse>('/settings/password', dto);
            return data.message;
        } catch (err) {
            setError("Failed to change password.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <SettingsContext.Provider value={{ getProfile, updateProfile, changePassword, loading, error }}>
            {children}
        </SettingsContext.Provider>
    );
}
