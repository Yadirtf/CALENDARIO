'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, DollarSign, Receipt } from 'lucide-react';
import { Company, Event } from '@/lib/types';
import { useEventStore } from '@/store/eventStore';
import { useEventActions } from '@/hooks/useEventActions';
import Select from '@/components/ui/Select';

interface CompanyEventsListProps {
    companies: Company[];
}

const CompanyEventsList: React.FC<CompanyEventsListProps> = ({ companies }) => {
    const { events, fetchEvents } = useEventStore();
    const { saveEvent } = useEventActions();
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        // Filtrar eventos según la empresa seleccionada
        if (selectedCompanyId === 'all') {
            // Mostrar todos los eventos de trabajo
            setFilteredEvents(events.filter((e) => e.isWork));
        } else {
            // Mostrar solo eventos de la empresa seleccionada
            setFilteredEvents(
                events.filter((e) => e.isWork && e.companyId === selectedCompanyId)
            );
        }
    }, [selectedCompanyId, events]);

    const handleStatusChange = async (event: Event, newStatus: 'pending' | 'in_progress' | 'paid') => {
        const updatedEvent = {
            ...event,
            workStatus: newStatus,
        };
        await saveEvent(updatedEvent, event);
        // Recargar eventos después de actualizar
        fetchEvents();
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'paid':
                return 'Pagado';
            case 'in_progress':
                return 'En Proceso';
            case 'pending':
                return 'Pendiente';
            default:
                return 'Sin estado';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'paid':
                return <DollarSign size={16} />;
            case 'in_progress':
                return <Clock size={16} />;
            case 'pending':
                return <CheckCircle2 size={16} />;
            default:
                return null;
        }
    };

    const getCompanyName = (companyId?: string) => {
        if (!companyId) return 'Sin empresa';
        const company = companies.find((c) => c._id === companyId);
        return company?.name || 'Sin empresa';
    };

    const selectedCompany = companies.find((c) => c._id === selectedCompanyId);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Eventos de Trabajo
                </h2>
                <div className="w-full sm:w-auto sm:min-w-[250px]">
                    <Select
                        label="Filtrar por empresa"
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        options={[
                            { value: 'all', label: 'Todas las empresas' },
                            ...companies.map((company) => ({
                                value: company._id || '',
                                label: company.name,
                            })),
                        ]}
                    />
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        {selectedCompanyId === 'all'
                            ? 'No hay eventos de trabajo registrados.'
                            : selectedCompany
                            ? `No hay eventos relacionados con ${selectedCompany.name}.`
                            : 'No hay eventos para mostrar.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div
                                className="w-1 h-full rounded flex-shrink-0"
                                style={{ backgroundColor: event.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                            {event.title}
                                        </h4>
                                        {selectedCompanyId === 'all' && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                {getCompanyName(event.companyId)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {event.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(event.startDate).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        {event.location && (
                                            <span className="truncate max-w-[200px]">{event.location}</span>
                                        )}
                                    </div>

                                    {/* Información de precio y viáticos */}
                                    {(event.price !== undefined || event.expenses !== undefined) && (
                                        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            {event.price !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Precio: <span className="text-green-600 dark:text-green-400">${event.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </span>
                                                </div>
                                            )}
                                            {event.includesExpenses && event.expenses !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <Receipt size={16} className="text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Viáticos: <span className="text-blue-600 dark:text-blue-400">${event.expenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </span>
                                                </div>
                                            )}
                                            {(event.price !== undefined || (event.includesExpenses && event.expenses !== undefined)) && (
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        Total: <span className="text-primary-600 dark:text-primary-400">
                                                            ${((event.price || 0) + (event.includesExpenses && event.expenses ? event.expenses : 0)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            Estado:
                                        </label>
                                        <select
                                            value={event.workStatus || 'pending'}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    event,
                                                    e.target.value as 'pending' | 'in_progress' | 'paid'
                                                )
                                            }
                                            className="text-xs py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Proceso</option>
                                            <option value="paid">Pagado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyEventsList;

