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
    <header className="h-16 border-b border-neutral-700/50 bg-surface/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-4 rounded-xl md:flex hidden hover:bg-light/5 text-neutral-300 interactive"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="hidden lg:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-neutral-900 border border-neutral-700/50 rounded-xl pl-10 pr-4 py-1.5 text-sm text-light outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all duration-180"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-neutral-300 hover:text-light transition-all duration-180 interactive">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full border border-surface"></span>
        </button>
        
        <Link to={role ? `/${role}/profile` : '#'} className="flex items-center space-x-3 border-l border-neutral-700/50 pl-4 hover:opacity-80 transition-opacity cursor-pointer group interactive">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-light leading-none group-hover:text-brand-violet transition-colors">{displayName}</p>
            <p className="text-xs text-neutral-500 mt-1 capitalize">{role || 'Role'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-violet to-brand-iris flex items-center justify-center border-2 border-surface shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-semibold text-light text-sm">
              {displayName.charAt(0)}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
