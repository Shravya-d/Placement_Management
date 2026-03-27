import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const EligibilityBadge = ({ isEligible, reasons = [] }) => {
  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
      isEligible 
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
    )}>
      {isEligible ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
      {isEligible ? 'Eligible to Apply' : 'Not Eligible'}
    </div>
  );
};

export default EligibilityBadge;
