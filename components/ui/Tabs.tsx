'use client';

import React from 'react';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px space-x-4" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                                ${
                                    isActive
                                        ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                            `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span
                                    className={`
                                        ml-2 py-0.5 px-2 rounded-full text-xs
                                        ${
                                            isActive
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }
                                    `}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

