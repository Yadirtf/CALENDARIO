import { useState } from 'react';
import { Event } from '@/lib/types';
import { useEventStore } from '@/store/eventStore';

interface UseEventActionsReturn {
    error: string | null;
    saveEvent: (eventData: Partial<Event>, selectedEvent: Event | null) => Promise<boolean>;
    clearError: () => void;
}

export const useEventActions = (): UseEventActionsReturn => {
    const { addEvent, updateEvent } = useEventStore();
    const [error, setError] = useState<string | null>(null);

    const saveEvent = async (
        eventData: Partial<Event>,
        selectedEvent: Event | null
    ): Promise<boolean> => {
        setError(null);
        try {
            if (selectedEvent?._id) {
                // Actualizar evento existente
                const response = await fetch(`/api/events/${selectedEvent._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData),
                });
                const data = await response.json();
                if (data.success) {
                    updateEvent(data.data);
                    return true;
                } else {
                    setError(data.error || 'Error al actualizar el evento');
                    return false;
                }
            } else {
                // Crear nuevo evento
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData),
                });
                const data = await response.json();
                if (data.success) {
                    addEvent(data.data);
                    return true;
                } else {
                    setError(data.error || 'Error al crear el evento');
                    return false;
                }
            }
        } catch (error) {
            setError('Error al guardar el evento');
            console.error('Error al guardar evento:', error);
            return false;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        error,
        saveEvent,
        clearError,
    };
};

