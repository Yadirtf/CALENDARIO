import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import TaskCard from '@/components/tasks/TaskCard';
import { TaskEmptyState } from './TaskEmptyState';
import { Task } from '@/lib/types';
import { Plus } from 'lucide-react';

interface TaskPanelProps {
    activeTasks: Task[];
    completedTasks: Task[];
    searchTerm: string;
    showTaskPanel: boolean;
    onToggleTaskPanel: () => void;
    onCreateTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onToggleComplete: (id: string, completed: boolean) => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
    activeTasks,
    completedTasks,
    searchTerm,
    showTaskPanel,
    onCreateTask,
    onEditTask,
    onDeleteTask,
    onToggleComplete,
}) => {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    const tabs = [
        { id: 'active', label: 'Tareas Activas', count: activeTasks.length },
        { id: 'completed', label: 'Tareas Realizadas', count: completedTasks.length },
    ];

    const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;

    return (
        <div
            className={`
                w-full lg:w-96
                ${showTaskPanel ? 'block' : 'hidden'}
                transition-all duration-300
            `}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:sticky lg:top-24 transition-colors">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Tareas</h2>
                    <Button onClick={onCreateTask} size="sm" variant="outline" className="p-1.5 sm:p-2">
                        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                </div>

                <div className="mb-3 sm:mb-4">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => setActiveTab(tabId as 'active' | 'completed')}
                    />
                </div>

                <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-350px)] overflow-y-auto pr-1 sm:pr-2">
                    {currentTasks.length === 0 ? (
                        <TaskEmptyState hasSearchTerm={!!searchTerm} />
                    ) : (
                        currentTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onToggleComplete={onToggleComplete}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

