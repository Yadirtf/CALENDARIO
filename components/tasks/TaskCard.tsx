'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Task } from '@/lib/types';
import { Calendar, Trash2, Edit, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onEdit,
    onDelete,
    onToggleComplete,
}) => {
    const priorityVariant = {
        low: 'info' as const,
        medium: 'warning' as const,
        high: 'danger' as const,
    };

    const priorityLabel = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
    };

    return (
        <Card className="hover:shadow-lg transition-shadow" padding="md">
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onToggleComplete(task._id!, !task.completed)}
                    className="mt-1 flex-shrink-0"
                >
                    {task.completed ? (
                        <CheckCircle className="text-green-600 dark:text-green-500" size={24} />
                    ) : (
                        <Circle className="text-gray-400 dark:text-gray-500" size={24} />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={`font-semibold text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                                }`}
                        >
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(task._id!)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge variant={priorityVariant[task.priority]}>
                            {priorityLabel[task.priority]}
                        </Badge>

                        {task.category && (
                            <Badge variant="secondary">{task.category}</Badge>
                        )}

                        {task.dueDate && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar size={14} />
                                <span>
                                    {format(new Date(task.dueDate), "d 'de' MMMM, yyyy", {
                                        locale: es,
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TaskCard;
