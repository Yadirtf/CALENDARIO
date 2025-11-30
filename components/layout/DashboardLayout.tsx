'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
