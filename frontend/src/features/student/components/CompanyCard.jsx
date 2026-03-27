import React from 'react';
import { Building2, DollarSign, GraduationCap, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import EligibilityBadge from './EligibilityBadge';
import { useAuthStore } from '../../auth/store/authStore';
import { useApplyToCompany } from '../hooks/useApplyToCompany';

const CompanyCard = ({ company, onClickFeedback }) => {
  const { user } = useAuthStore();
  const { mutate: apply, isPending } = useApplyToCompany();
  
  const isEligible = user?.cgpa >= company.cgpaCriteria;

  const handleApply = () => { apply(company._id); };

  const hasApplied = user?.applications?.some(a => a.companyId === company._id) || company.applicants?.some(a => a.studentId === user?._id);
  const deadlineDate = company.applicationDeadline ? new Date(company.applicationDeadline) : null;
  const isExpired = deadlineDate ? Date.now() > deadlineDate.getTime() : false;

  return (
    <div className="glass-card p-6 flex flex-col h-full card transition-transform duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-border shadow-inner">
          <Building2 className="w-6 h-6 text-accent-primary" />
        </div>
        <EligibilityBadge isEligible={isEligible} />
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{company.companyName}</h3>
      <p className="text-sm text-accent-primary font-medium mb-4">{company.role}</p>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center text-sm text-text-secondary">
          <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
          <span>{company.numberOfCandidates > 1 ? 'Multiple Openings' : 'Limited Roles'}</span>
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <GraduationCap className="w-4 h-4 mr-2 text-amber-400" />
          <span>Requires {company.cgpaCriteria} CGPA min</span>
        </div>
        {deadlineDate && (
           <div className="flex items-center text-sm">
             <Clock className={cn("w-4 h-4 mr-2", isExpired ? "text-rose-500" : "text-sky-400")} />
             <span className={isExpired ? "text-rose-400 font-semibold" : "text-text-secondary"}>
               {isExpired ? "Closed exactly on " : "Closes: "} 
               {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(deadlineDate)}
             </span>
           </div>
        )}
        
        <div className="pt-3">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {company.jdSkills?.slice(0, 3).map((skill, i) => (
              <span key={i} className="px-2 py-1 rounded bg-surface border border-border text-xs text-text-primary">{skill}</span>
            ))}
            {company.jdSkills?.length > 3 && (
              <span className="px-2 py-1 rounded bg-surface border border-border text-xs text-text-muted">+{company.jdSkills.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
        <button onClick={() => onClickFeedback(company._id)} className="flex-1 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium hover:bg-white/5 transition-colors">
          View Feedback
        </button>
        {hasApplied ? (
           <button disabled className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-medium transition-all flex items-center justify-center">
             Applied
           </button>
        ) : isExpired ? (
           <button disabled className="flex-1 py-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-sm font-medium transition-all flex items-center justify-center cursor-not-allowed">
             <AlertCircle className="w-4 h-4 mr-2" />
             Deadline Passed
           </button>
        ) : (
          <button onClick={handleApply} disabled={!isEligible || isPending} className={cn("flex-1 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center transition-all", isEligible ? "bg-gradient-to-r from-accent-primary to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:shadow-indigo-500/25" : "bg-surface-raised text-text-muted cursor-not-allowed", isPending ? "opacity-70" : "")}>
            {isPending ? 'Applying...' : 'Apply Now'}
            {!isPending && isEligible && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
