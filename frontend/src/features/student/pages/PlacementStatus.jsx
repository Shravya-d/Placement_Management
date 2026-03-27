import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { GraduationCap } from 'lucide-react';

const PlacementStatus = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 rounded-full bg-surface-raised flex items-center justify-center border border-border mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
         <GraduationCap className="w-12 h-12 text-accent-primary" />
      </div>
      <h1 className="text-4xl font-bold text-white tracking-tight text-center">Placement Status</h1>
      
      <div className="glass-card p-8 min-w-[300px] text-center border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
         <div className="text-sm font-medium text-text-muted mb-2 uppercase tracking-widest">Current Status</div>
         <div className="text-3xl font-bold text-emerald-400 tracking-tight">
           {user?.placementStatus || 'ACTIVE'}
         </div>
      </div>
    </div>
  );
};

export default PlacementStatus;
