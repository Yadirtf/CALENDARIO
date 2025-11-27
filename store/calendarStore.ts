import { create } from 'zustand';
import { CalendarView } from '@/lib/types';

interface CalendarState {
    view: CalendarView;
    date: Date;
    setView: (view: CalendarView) => void;
    setDate: (date: Date) => void;
    nextMonth: () => void;
    prevMonth: () => void;
    today: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
    view: 'month',
    date: new Date(),
    setView: (view) => set({ view }),
    setDate: (date) => set({ date }),
    nextMonth: () =>
        set((state) => {
            const newDate = new Date(state.date);
            newDate.setMonth(newDate.getMonth() + 1);
            return { date: newDate };
        }),
    prevMonth: () =>
        set((state) => {
            const newDate = new Date(state.date);
            newDate.setMonth(newDate.getMonth() - 1);
            return { date: newDate };
        }),
    today: () => set({ date: new Date() }),
}));
