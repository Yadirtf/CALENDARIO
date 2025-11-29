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
    // Campos relacionados con trabajo
    isWork?: boolean;
    companyId?: string;
    workStatus?: 'pending' | 'in_progress' | 'paid';
    price?: number;
    includesExpenses?: boolean;
    expenses?: number;
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

export interface User {
    _id?: string;
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    provider: 'email' | 'google';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface Company {
    _id?: string;
    name: string;
    nit?: string;
    country: string;
    address?: string;
    phone: string;
    email?: string;
    website?: string;
    logo?: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}