import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/components/Sidebar';
import Topbar from '../shared/components/Topbar';
import { useUIStore } from '../shared/store/uiStore';
import { cn } from '../shared/utils/cn';

const AlumniLayout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen flex">
      <Sidebar role="alumni" />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-[80px]",
        sidebarOpen ? "md:ml-[260px]" : ""
      )}>
        <Topbar />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-x-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AlumniLayout;
