import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Briefcase, Building2, Quote, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlumniDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center">
          Welcome back, {user?.studentData?.name || user?.name || 'Alumnus'}
        </h1>
        <p className="text-text-secondary">Your alumni portal. Share your expertise with the next generation.</p>
      </div>

      <div className="glass-card p-8 border-l-4 border-l-accent-alumni shadow-[0_0_40px_rgba(16,185,129,0.1)]">
         <div className="flex items-start md:items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center shrink-0 shadow-inner">
               <Building2 className="w-8 h-8 text-accent-alumni" />
            </div>
            <div>
               <h3 className="text-lg font-medium text-text-muted mb-1 uppercase tracking-widest">Currently Placed At</h3>
               <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-alumni to-emerald-400">
                  {user?.companyJoined || 'Acme Corp'}
               </p>
               <p className="text-white mt-1 font-medium">{user?.role || 'Software Engineer'}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Link to="/alumni/network" className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors border-accent-primary/20 shadow-[0_4px_20px_rgba(99,102,241,0.05)]">
            <div>
              <h4 className="text-lg font-bold text-accent-primary mb-2">My Network</h4>
              <p className="text-sm text-text-muted">Connect with other placed peers.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-primary/30 transition-all">
               <Users className="w-6 h-6 text-accent-primary" />
            </div>
         </Link>

         {/* Placeholder link to feedback modal/page */}
         <button className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.05)] text-left w-full">
            <div>
              <h4 className="text-lg font-bold text-emerald-400 mb-2">Give Feedback</h4>
              <p className="text-sm text-text-muted">Review {user?.companyJoined || 'your company'} for juniors.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
               <Quote className="w-6 h-6 text-emerald-500" />
            </div>
         </button>
      </div>
    </div>
  );
};

export default AlumniDashboard;
