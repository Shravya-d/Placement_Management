import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { GraduationCap } from 'lucide-react';

const PlacementStatus = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 rounded-full bg-deep flex items-center justify-center border border-neutral-700/50 mb-6 shadow-[0_4px_20px_rgba(123,92,240,0.4)]">
         <GraduationCap className="w-12 h-12 text-brand-violet" />
      </div>
      <h1 className="text-4xl font-bold text-light tracking-tight text-center">Placement Status</h1>
      
      <div className="glass-card p-8 min-w-[300px] text-center border-emerald-500/20 shadow-[0_0_20px_rgba(0,212,170,0.1)]">
         <div className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-widest">Current Status</div>
         <div className="text-3xl font-bold text-emerald-400 tracking-tight">
           {user?.placementStatus || 'ACTIVE'}
         </div>
      </div>
    </div>
  );
};

export default PlacementStatus;
