import axios from 'axios';

const BASE_URL = 'https://localhost:7249/api/calendar';

export interface CalendarEventPayload {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  color?: string;
  eventType?: string;
  userId: number;
}

export const calendarService = {
  getAllEvents: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getEventsByUser: async (userId: number) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  getEventById: async (eventId: number) => {
    const response = await axios.get(`${BASE_URL}/${eventId}`);
    return response.data;
  },

  createEvent: async (data: CalendarEventPayload) => {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  },

  updateEvent: async (eventId: number, data: Partial<CalendarEventPayload>) => {
    const response = await axios.put(`${BASE_URL}/${eventId}`, data);
    return response.data;
  },

  deleteEvent: async (eventId: number) => {
    const response = await axios.delete(`${BASE_URL}/${eventId}`);
    return response.data;
  }
};