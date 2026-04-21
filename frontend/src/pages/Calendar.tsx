import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { Modal } from '../components/ui/Modal';
import { calendarService, CalendarEventPayload } from '../axios/calendarService';
import type { CalendarEvent } from '../_mock/mockCalendar';