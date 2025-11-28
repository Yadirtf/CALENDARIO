import { useState } from 'react';
import { Task } from '@/lib/types';
import { useTaskStore } from '@/store/taskStore';
import { getAuthToken } from '@/lib/auth/getAuthToken';

interface UseTaskActionsReturn {
    error: string | null;
    saveTask: (taskData: Partial<Task>, selectedTask: Task | null) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
    toggleTaskComplete: (id: string, completed: boolean) => Promise<boolean>;
    clearError: () => void;
}

export const useTaskActions = (): UseTaskActionsReturn => {
    const { addTask, updateTask, deleteTask: removeTask } = useTaskStore();
    const [error, setError] = useState<string | null>(null);

    const saveTask = async (
        taskData: Partial<Task>,
        selectedTask: Task | null
    ): Promise<boolean> => {
        setError(null);
        try {
            const token = await getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (selectedTask?._id) {
                // Actualizar tarea existente
                const response = await fetch(`/api/tasks/${selectedTask._id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(taskData),
                });
                const data = await response.json();
                if (data.success) {
                    updateTask(data.data);
                    return true;
                } else {
                    setError(data.error || 'Error al actualizar la tarea');
                    return false;
                }
            } else {
                // Crear nueva tarea
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(taskData),
                });
                const data = await response.json();
                if (data.success) {
                    addTask(data.data);
                    return true;
                } else {
                    setError(data.error || 'Error al crear la tarea');
                    return false;
                }
            }
        } catch (error) {
            setError('Error al guardar la tarea');
            console.error('Error al guardar tarea:', error);
            return false;
        }
    };

    const deleteTask = async (id: string): Promise<boolean> => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return false;
        }

        setError(null);
        try {
            const token = await getAuthToken();
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers,
            });
            const data = await response.json();
            if (data.success) {
                removeTask(id);
                return true;
            } else {
                setError(data.error || 'Error al eliminar la tarea');
                return false;
            }
        } catch (error) {
            setError('Error al eliminar la tarea');
            console.error('Error al eliminar tarea:', error);
            return false;
        }
    };

    const toggleTaskComplete = async (id: string, completed: boolean): Promise<boolean> => {
        setError(null);
        try {
            const token = await getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ completed }),
            });
            const data = await response.json();
            if (data.success) {
                updateTask(data.data);
                return true;
            } else {
                setError(data.error || 'Error al actualizar la tarea');
                return false;
            }
        } catch (error) {
            setError('Error al actualizar la tarea');
            console.error('Error al actualizar tarea:', error);
            return false;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        error,
        saveTask,
        deleteTask,
        toggleTaskComplete,
        clearError,
    };
};

