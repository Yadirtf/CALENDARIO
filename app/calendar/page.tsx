'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import CalendarView from '@/components/calendar/CalendarView';
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar';
import { TaskPanel } from '@/components/tasks/TaskPanel';
import EventModal from '@/components/events/EventModal';
import TaskModal from '@/components/tasks/TaskModal';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Event, Task, CalendarEvent } from '@/lib/types';
import { useEventStore } from '@/store/eventStore';
import { useTaskStore } from '@/store/taskStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useEventActions } from '@/hooks/useEventActions';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useCalendarFilters } from '@/hooks/useCalendarFilters';
import { useAuth } from '@/contexts/AuthContext';

export default function CalendarPage() {
    const { user, loading: authLoading } = useAuth();
    const { events, fetchEvents } = useEventStore();
    const { tasks, fetchTasks } = useTaskStore();
    const { categories, fetchCategories } = useCategoryStore();

    const { error: eventError, saveEvent, clearError: clearEventError } = useEventActions();
    const {
        error: taskError,
        saveTask,
        deleteTask,
        toggleTaskComplete,
        clearError: clearTaskError,
    } = useTaskActions();

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showTaskPanel, setShowTaskPanel] = useState(true);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Cargar datos iniciales solo cuando el usuario esté autenticado
    useEffect(() => {
        if (!authLoading && user) {
            fetchEvents();
            fetchTasks();
            fetchCategories();
        }
    }, [authLoading, user, fetchEvents, fetchTasks, fetchCategories]);

    const { filteredEvents, filteredTasks, completedTasks, calendarEvents } = useCalendarFilters({
        events,
        tasks,
        searchTerm,
        categoryFilter,
        priorityFilter,
    });

    const handleOpenEventModal = (event: Event | null = null, slot: { start: Date; end: Date } | null = null) => {
        setSelectedEvent(event);
        setSelectedSlot(slot);
        setIsEventModalOpen(true);
        clearEventError();
    };

    const handleCloseEventModal = () => {
        setIsEventModalOpen(false);
        setSelectedEvent(null);
        setSelectedSlot(null);
        clearEventError();
    };

    const handleSaveEvent = async (eventData: Partial<Event>) => {
        const success = await saveEvent(eventData, selectedEvent);
        if (success) {
            handleCloseEventModal();
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        const fullEvent = events.find((e) => e._id === event._id);
        if (fullEvent) {
            handleOpenEventModal(fullEvent, null);
        }
    };

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        handleOpenEventModal(null, slotInfo);
    };

    const handleOpenTaskModal = (task: Task | null = null) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
        clearTaskError();
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setSelectedTask(null);
        clearTaskError();
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        const success = await saveTask(taskData, selectedTask);
        if (success) {
            handleCloseTaskModal();
        }
    };

    const handleEditTask = (task: Task) => {
        handleOpenTaskModal(task);
    };

    return (
        <AuthGuard>
            <DashboardLayout>
            <div className="flex flex-col gap-6">
                <CalendarToolbar
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    priorityFilter={priorityFilter}
                    showTaskPanel={showTaskPanel}
                    categories={categories}
                    onSearchChange={setSearchTerm}
                    onCategoryFilterChange={setCategoryFilter}
                    onPriorityFilterChange={setPriorityFilter}
                    onToggleTaskPanel={() => setShowTaskPanel(!showTaskPanel)}
                    onCreateEvent={() => handleOpenEventModal(null, null)}
                />

                {(eventError || taskError) && (
                    <ErrorMessage
                        message={eventError || taskError || ''}
                        onDismiss={eventError ? clearEventError : clearTaskError}
                    />
                )}

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                        <CalendarView
                            events={calendarEvents}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                        />
                    </div>

                    <TaskPanel
                        activeTasks={filteredTasks}
                        completedTasks={completedTasks}
                        searchTerm={searchTerm}
                        showTaskPanel={showTaskPanel}
                        onToggleTaskPanel={() => setShowTaskPanel(!showTaskPanel)}
                        onCreateTask={() => handleOpenTaskModal(null)}
                        onEditTask={handleEditTask}
                        onDeleteTask={deleteTask}
                        onToggleComplete={toggleTaskComplete}
                    />
                </div>
            </div>

            <EventModal
                isOpen={isEventModalOpen}
                onClose={handleCloseEventModal}
                onSave={handleSaveEvent}
                event={selectedEvent}
                initialData={selectedSlot}
                categories={categories}
            />

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onSave={handleSaveTask}
                task={selectedTask}
                categories={categories}
            />
            </DashboardLayout>
        </AuthGuard>
    );
}
