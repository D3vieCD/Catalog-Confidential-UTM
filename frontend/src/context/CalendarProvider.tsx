import { createContext, useState, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";

export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    color?: string;
    eventType?: string;
    userId: number;
    createdOn: string;
}

export interface CalendarEventActionResponse {
    isValid: boolean;
    message: string;
    calendarEvent?: CalendarEvent;
    calendarEvents?: CalendarEvent[];
}

export interface CreateCalendarEventDto {
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    color?: string;
    eventType?: string;
    userId: number;
}

export interface UpdateCalendarEventDto {
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    color?: string;
    eventType?: string;
    userId: number;
}

export interface CalendarContextType {
    loading: boolean;
    error: string | null;
    getAllEvents: () => Promise<CalendarEvent[]>;
    getEventsByUserId: (userId: number) => Promise<CalendarEvent[]>;
    getEventById: (eventId: number) => Promise<CalendarEvent>;
    createEvent: (data: CreateCalendarEventDto) => Promise<CalendarEvent>;
    updateEvent: (eventId: number, data: UpdateCalendarEventDto) => Promise<CalendarEvent>;
    deleteEvent: (eventId: number) => Promise<string>;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getAllEvents(): Promise<CalendarEvent[]> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.get<CalendarEventActionResponse>(`/calendar`);
            return res.calendarEvents || [];
        } catch (err) {
            setError("Failed to retrieve events.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getEventsByUserId(userId: number): Promise<CalendarEvent[]> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.get<CalendarEventActionResponse>(`/calendar/user/${userId}`);
            return res.calendarEvents || [];
        } catch (err) {
            setError("Failed to retrieve events.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getEventById(eventId: number): Promise<CalendarEvent> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.get<CalendarEventActionResponse>(`/calendar/${eventId}`);
            if (res.calendarEvent) return res.calendarEvent;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to retrieve event.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function createEvent(data: CreateCalendarEventDto): Promise<CalendarEvent> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.post<CalendarEventActionResponse>(`/calendar`, data);
            if (res.isValid) return res.calendarEvent as CalendarEvent;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to create event.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateEvent(eventId: number, data: UpdateCalendarEventDto): Promise<CalendarEvent> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.put<CalendarEventActionResponse>(`/calendar/${eventId}`, data);
            if (res.isValid) return res.calendarEvent as CalendarEvent;
            throw new Error(res.message);
        } catch (err) {
            setError("Failed to update event.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteEvent(eventId: number): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data: res } = await axios.delete<CalendarEventActionResponse>(`/calendar/${eventId}`);
            return res.message;
        } catch (err) {
            setError("Failed to delete event.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <CalendarContext.Provider value={{ getAllEvents, getEventsByUserId, getEventById, createEvent, updateEvent, deleteEvent, loading, error }}>
            {children}
        </CalendarContext.Provider>
    );
}
