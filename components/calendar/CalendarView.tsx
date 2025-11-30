'use client';

import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CalendarEvent } from '@/lib/types';

// Configurar localizer con date-fns
const locales = {
    es: es,
};

// Configurar startOfWeek para que comience en lunes (1) en lugar de domingo (0)
const startOfWeekMonday = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: startOfWeekMonday,
    getDay,
    locales,
});

interface CalendarViewProps {
    events: CalendarEvent[];
    onSelectEvent?: (event: CalendarEvent) => void;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
    onNavigate?: (date: Date) => void;
    onViewChange?: (view: View) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    events,
    onSelectEvent,
    onSelectSlot,
    onNavigate,
    onViewChange,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<View>('month');

    const handleNavigate = useCallback((date: Date) => {
        setCurrentDate(date);
        onNavigate?.(date);
    }, [onNavigate]);

    const handleViewChange = useCallback((view: View) => {
        setCurrentView(view);
        onViewChange?.(view);
    }, [onViewChange]);

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (currentView === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        handleNavigate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (currentView === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        handleNavigate(newDate);
    };

    const handleToday = () => {
        handleNavigate(new Date());
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        return {
            style: {
                backgroundColor: event.color || '#3b82f6',
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    const messages = {
        allDay: 'Todo el día',
        previous: 'Anterior',
        next: 'Siguiente',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango',
        showMore: (total: number) => `+ Ver más (${total})`,
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 transition-colors relative">
            {/* Toolbar personalizado */}
            <div className="flex flex-col gap-3 mb-3 sm:mb-4">
                {/* Primera fila: Navegación y fecha */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button onClick={handlePrevious} variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                        </Button>
                        <Button onClick={handleToday} variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                            Hoy
                        </Button>
                        <Button onClick={handleNext} variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                        </Button>
                    </div>

                    <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100 text-center flex-1">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                </div>

                {/* Segunda fila: Vistas */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <Button
                        onClick={() => handleViewChange('month')}
                        variant={currentView === 'month' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-initial"
                    >
                        Mes
                    </Button>
                    <Button
                        onClick={() => handleViewChange('week')}
                        variant={currentView === 'week' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-initial"
                    >
                        Semana
                    </Button>
                    <Button
                        onClick={() => handleViewChange('day')}
                        variant={currentView === 'day' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-initial"
                    >
                        Día
                    </Button>
                </div>
            </div>

            {/* Calendario */}
            <div className="h-[400px] sm:h-[500px] md:h-[600px] overflow-x-auto overflow-y-auto -mx-2 sm:mx-0 px-2 sm:px-0 calendar-container" style={{ position: 'relative', zIndex: 1 }}>
                <BigCalendar
                    localizer={localizer}
                    culture="es"
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title"
                    view={currentView}
                    onView={handleViewChange}
                    date={currentDate}
                    onNavigate={handleNavigate}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    messages={messages}
                    toolbar={false}
                />
            </div>
        </div>
    );
};

export default CalendarView;
