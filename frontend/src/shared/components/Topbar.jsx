import React from 'react';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useUIStore } from '../store/uiStore';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { user, role } = useAuthStore();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  
  const displayName = user?.name || user?.adminDetails?.name || user?.studentData?.name || 'User';

  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-4 rounded-lg md:flex hidden hover:bg-white/5 text-text-secondary"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="hidden lg:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-surface-raised border border-border rounded-lg pl-10 pr-4 py-1.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-accent-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-surface"></span>
        </button>
        
        <Link to={role ? `/${role}/profile` : '#'} className="flex items-center space-x-3 border-l border-border pl-4 hover:opacity-80 transition-opacity cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none group-hover:text-accent-primary transition-colors">{displayName}</p>
            <p className="text-xs text-text-muted mt-1 capitalize">{role || 'Role'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-primary to-indigo-400 flex items-center justify-center border-2 border-surface-raised shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-semibold text-white text-sm">
              {displayName.charAt(0)}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
