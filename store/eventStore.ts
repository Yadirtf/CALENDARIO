import { create } from 'zustand';
import { Event } from '@/lib/types';

interface EventState {
    events: Event[];
    selectedEvent: Event | null;
    isLoading: boolean;
    error: string | null;
    setEvents: (events: Event[]) => void;
    addEvent: (event: Event) => void;
    updateEvent: (event: Event) => void;
    deleteEvent: (id: string) => void;
    setSelectedEvent: (event: Event | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    selectedEvent: null,
    isLoading: false,
    error: null,
    setEvents: (events) => set({ events }),
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    updateEvent: (updatedEvent) =>
        set((state) => ({
            events: state.events.map((e) =>
                e._id === updatedEvent._id ? updatedEvent : e
            ),
        })),
    deleteEvent: (id) =>
        set((state) => ({
            events: state.events.filter((e) => e._id !== id),
        })),
    setSelectedEvent: (event) => set({ selectedEvent: event }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            if (data.success) {
                set({ events: data.data });
            } else {
                set({ error: data.error });
            }
        } catch (error: any) {
            set({ error: error.message || 'Error al cargar eventos' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
