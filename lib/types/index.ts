export interface Event {
    _id?: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    category: string;
    color: string;
    location?: string;
    reminder?: Date;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Task {
    _id?: string;
    title: string;
    description?: string;
    dueDate?: Date;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    color?: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    _id?: string;
    name: string;
    color: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent extends Event {
    start: Date;
    end: Date;
}
