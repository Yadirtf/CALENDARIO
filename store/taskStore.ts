import { create } from 'zustand';
import { Task } from '@/lib/types';

interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    isLoading: boolean;
    error: string | null;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    setSelectedTask: (task: Task | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    selectedTask: null,
    isLoading: false,
    error: null,
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t._id === updatedTask._id ? updatedTask : t
            ),
        })),
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t._id !== id),
        })),
    setSelectedTask: (task) => set({ selectedTask: task }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const { getAuthToken } = await import('@/lib/auth/getAuthToken');
            const token = await getAuthToken();
            
            if (!token) {
                set({ isLoading: false, error: null });
                return;
            }
            
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
            };
            
            const response = await fetch('/api/tasks', { headers });
            const data = await response.json();
            
            if (response.status === 401) {
                // Usuario no autenticado, no es un error crítico
                set({ tasks: [], isLoading: false, error: null });
                return;
            }
            
            if (data.success) {
                set({ tasks: data.data });
            } else {
                set({ error: data.error });
            }
        } catch (error: any) {
            // Solo mostrar error si no es un 401 (no autenticado)
            if (error.message && !error.message.includes('401')) {
                set({ error: error.message || 'Error al cargar tareas' });
            }
        } finally {
            set({ isLoading: false });
        }
    },
}));
