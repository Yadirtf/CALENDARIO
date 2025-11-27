import { useMemo } from 'react';
import { Event, Task, CalendarEvent } from '@/lib/types';

interface UseCalendarFiltersProps {
    events: Event[];
    tasks: Task[];
    searchTerm: string;
    categoryFilter: string;
    priorityFilter: string;
}

interface UseCalendarFiltersReturn {
    filteredEvents: Event[];
    filteredTasks: Task[];
    completedTasks: Task[];
    calendarEvents: CalendarEvent[];
}

export const useCalendarFilters = ({
    events,
    tasks,
    searchTerm,
    categoryFilter,
    priorityFilter,
}: UseCalendarFiltersProps): UseCalendarFiltersReturn => {
    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
            return matchesSearch && matchesCategory;
        });
    }, [events, searchTerm, categoryFilter]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
            const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
            return matchesSearch && matchesCategory && matchesPriority && !task.completed;
        });
    }, [tasks, searchTerm, categoryFilter, priorityFilter]);

    const completedTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
            const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
            return matchesSearch && matchesCategory && matchesPriority && task.completed;
        });
    }, [tasks, searchTerm, categoryFilter, priorityFilter]);

    const calendarEvents: CalendarEvent[] = useMemo(() => {
        return filteredEvents.map((event) => ({
            ...event,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
        }));
    }, [filteredEvents]);

    return {
        filteredEvents,
        filteredTasks,
        completedTasks,
        calendarEvents,
    };
};

