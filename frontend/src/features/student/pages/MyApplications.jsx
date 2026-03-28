import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useEligibleCompanies } from '../hooks/useEligibleCompanies';
import { Briefcase, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const MyApplications = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useEligibleCompanies();
  
  const companies = data?.data?.companies || [];

  // Derive applications dynamically from the companies array to guarantee synch with the Apply button.
  const applications = companies
    .filter(c => c.applicants?.some(a => a.studentId === user?._id || a.studentId === user?.id))
    .map(c => {
      const applicant = c.applicants.find(a => a.studentId === user?._id || a.studentId === user?.id);
      return {
        companyId: c._id,
        companyName: c.companyName,
        status: applicant.status,
        appliedAt: new Date(applicant.appliedAt)
      };
    })
    .sort((a,b) => b.appliedAt - a.appliedAt);

  const getStatusInfo = (status) => {
    switch(status) {
      case 'SELECTED': return { color: 'text-emerald-400', icon: CheckCircle2, bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', border: 'border-emerald-500/30' };
      case 'REJECTED': return { color: 'text-rose-400', icon: XCircle, bg: 'bg-rose-500/10 hover:bg-rose-500/20', border: 'border-rose-500/30' };
      default: return { color: 'text-indigo-400', icon: Clock, bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', border: 'border-indigo-500/30' };
    }
  }

  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-accent-gold/10 rounded-2xl border border-accent-gold/20">
          <Briefcase className="w-8 h-8 text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-light tracking-tight">My Applications</h1>
          <p className="text-neutral-500 mt-1 text-sm">Track the status of your company applications in real-time.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-light/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, i) => {
            const statusInfo = getStatusInfo(app.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={i} className={cn("glass-card p-6 flex flex-col justify-between interactive group", statusInfo.bg, statusInfo.border)}>
                 <div className="flex items-start justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center border border-light/5">
                        <Building2 className="w-5 h-5 text-light" />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-light group-hover:text-amber-400 transition-colors">{app.companyName}</h3>
                       <p className="text-[10px] text-neutral-500 mt-0.5">APPLIED {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(app.appliedAt)}</p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-6 flex items-center justify-end border-t border-light/10 pt-4">
                    <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest mr-2">Status</span>
                    <div className="flex items-center px-3 py-1 bg-deep rounded-md border border-light/5">
                      <StatusIcon className={cn("w-4 h-4 mr-1.5", statusInfo.color)} />
                      <span className={cn("font-bold text-sm tracking-wide", statusInfo.color)}>{app.status}</span>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center max-w-lg mx-auto border-dashed border-light/10">
            <Building2 className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-light">No applications yet</h3>
            <p className="text-neutral-500 mt-2">Apply to eligible companies from your dashboard and track them here.</p>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
