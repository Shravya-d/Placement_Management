import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import { gsap } from '../../animations/gsap.config';
import { cn } from '../utils/cn';
import { LayoutDashboard, Briefcase, GraduationCap, Users, LogOut, CheckSquare } from 'lucide-react';

const roleConfig = {
  student: [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Applications', path: '/student/applications', icon: Briefcase },
    { name: 'Status', path: '/student/status', icon: GraduationCap }
  ],
  admin: [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Companies', path: '/admin/companies', icon: Briefcase },
    { name: 'Selection', path: '/admin/selection', icon: CheckSquare }
  ],
  alumni: [
    { name: 'Dashboard', path: '/alumni', icon: LayoutDashboard },
    { name: 'Network', path: '/alumni/network', icon: Users },
  ]
};

const Sidebar = ({ role }) => {
  const { sidebarOpen } = useUIStore();
  const { logout } = useAuthStore();
  const sidebarRef = useRef(null);
  const labelsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = roleConfig[role] || [];
  const accentColor = role === 'admin' ? 'text-accent-admin bg-accent-admin/10' : role === 'alumni' ? 'text-accent-alumni bg-accent-alumni/10' : 'text-accent-primary bg-accent-primary/10';
  const iconAccent = role === 'admin' ? 'text-accent-admin' : role === 'alumni' ? 'text-accent-alumni' : 'text-accent-primary';

  useEffect(() => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.to(sidebarRef.current, { width: 260, duration: 0.35, ease: "power2.inOut" });
        gsap.to(labelsRef.current.filter(Boolean), { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, delay: 0.1 });
      } else {
        gsap.to(labelsRef.current.filter(Boolean), { opacity: 0, x: -10, duration: 0.1 });
        gsap.to(sidebarRef.current, { width: 80, duration: 0.35, ease: "power2.inOut", delay: 0.1 });
      }
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        ref={sidebarRef}
        className="hidden md:flex flex-col h-screen fixed top-0 left-0 bg-surface border-r border-border z-40 overflow-hidden shrink-0"
        style={{ width: "260px" }}
      >
        <div className="p-6 flex items-center mb-8 shrink-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0", 
            role === 'admin' ? 'bg-accent-admin' : role === 'alumni' ? 'bg-accent-alumni' : 'bg-accent-primary'
          )}>
            <span className="font-bold text-white text-xl">P</span>
          </div>
          <span ref={el => labelsRef.current[0] = el} className="ml-3 text-xl font-bold tracking-tight text-white whitespace-nowrap">
            PlacementSync
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto w-full">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== `/${role}` && location.pathname.startsWith(item.path));
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-colors duration-200 w-full group overflow-hidden",
                  isActive ? accentColor : "text-text-secondary hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive ? iconAccent : "")} />
                <span ref={el => labelsRef.current[i+1] = el} className={cn("ml-4 font-medium whitespace-nowrap", isActive ? 'text-white' : '')}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 w-full">
           <button 
             onClick={handleLogout}
             className="flex items-center px-4 py-3 w-full rounded-xl text-text-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-colors group"
           >
             <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
             <span ref={el => labelsRef.current[navItems.length+1] = el} className="ml-4 font-medium whitespace-nowrap">Logout</span>
           </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.path || (item.path !== `/${role}` && location.pathname.startsWith(item.path));
             return (
               <NavLink key={item.path} to={item.path} className="flex flex-col items-center justify-center p-2">
                 <Icon className={cn("w-5 h-5 mb-1", isActive ? iconAccent : "text-text-muted")} />
                 <span className={cn("text-[10px] font-medium", isActive ? iconAccent : "text-text-muted")}>{item.name}</span>
               </NavLink>
             )
          })}
      </div>
    </>
  );
};

export default Sidebar;
