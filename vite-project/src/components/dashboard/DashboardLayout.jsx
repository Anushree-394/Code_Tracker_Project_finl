import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-slate-950 min-h-screen relative">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 shadow-lg shadow-fuchsia-500/20 active:scale-95 transition-transform"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Desktop & Mobile */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <Sidebar />
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 w-full lg:ml-72">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
