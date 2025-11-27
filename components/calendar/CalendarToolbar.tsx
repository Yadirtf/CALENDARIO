import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Plus, ListTodo, Search, Filter, X } from 'lucide-react';
import { Category } from '@/lib/types';

interface CalendarToolbarProps {
    searchTerm: string;
    categoryFilter: string;
    priorityFilter: string;
    showTaskPanel: boolean;
    categories: Category[];
    onSearchChange: (value: string) => void;
    onCategoryFilterChange: (value: string) => void;
    onPriorityFilterChange: (value: string) => void;
    onToggleTaskPanel: () => void;
    onCreateEvent: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
    searchTerm,
    categoryFilter,
    priorityFilter,
    showTaskPanel,
    categories,
    onSearchChange,
    onCategoryFilterChange,
    onPriorityFilterChange,
    onToggleTaskPanel,
    onCreateEvent,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-3 transition-colors">
            {/* Primera fila: Búsqueda y botones principales */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar eventos o tareas..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        size="sm"
                        className="md:hidden"
                    >
                        <Filter size={18} className="sm:mr-2" />
                        <span className="hidden sm:inline">Filtros</span>
                    </Button>
                    <Button onClick={onCreateEvent} size="sm" className="flex-1 sm:flex-initial">
                        <Plus size={18} className="sm:mr-2" />
                        <span className="hidden sm:inline">Nuevo Evento</span>
                        <span className="sm:hidden">Evento</span>
                    </Button>
                    <Button
                        onClick={onToggleTaskPanel}
                        variant={showTaskPanel ? 'primary' : 'outline'}
                        size="sm"
                    >
                        <ListTodo size={18} />
                    </Button>
                </div>
            </div>

            {/* Filtros: Desktop siempre visible, Mobile colapsable */}
            <div
                className={`
                    ${showFilters ? 'block' : 'hidden'} md:block
                    border-t border-gray-200 dark:border-gray-700 pt-3 mt-3
                `}
            >
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="md:hidden flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <Select
                        value={categoryFilter}
                        onChange={(e) => onCategoryFilterChange(e.target.value)}
                        options={[
                            { value: '', label: 'Todas las categorías' },
                            ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
                        ]}
                        className="w-full sm:w-auto sm:min-w-[180px]"
                    />

                    <Select
                        value={priorityFilter}
                        onChange={(e) => onPriorityFilterChange(e.target.value)}
                        options={[
                            { value: '', label: 'Todas las prioridades' },
                            { value: 'high', label: 'Alta' },
                            { value: 'medium', label: 'Media' },
                            { value: 'low', label: 'Baja' },
                        ]}
                        className="w-full sm:w-auto sm:min-w-[180px]"
                    />
                </div>
            </div>
        </div>
    );
};

