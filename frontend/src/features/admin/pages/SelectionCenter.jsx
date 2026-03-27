import React from 'react';
import { CheckSquare } from 'lucide-react';

const SelectionCenter = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <CheckSquare className="w-8 h-8 text-accent-admin" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Selection Center</h1>
      </div>
      
      <div className="glass-card p-12 text-center border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <h3 className="text-xl font-bold text-amber-400">Student Migration Workflow</h3>
        <p className="text-text-muted mt-2 max-w-lg mx-auto">
          Here you will be able to select eligible students per company and trigger the matching migration which moves them to Alumni.
        </p>
      </div>
    </div>
  );
};

export default SelectionCenter;
