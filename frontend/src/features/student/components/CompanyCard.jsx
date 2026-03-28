import React from 'react';
import { Building2, DollarSign, GraduationCap, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import EligibilityBadge from './EligibilityBadge';
import { useAuthStore } from '../../auth/store/authStore';
import { useApplyToCompany } from '../hooks/useApplyToCompany';

const CompanyCard = ({ company, onClickFeedback }) => {
  const { user } = useAuthStore();
  const { mutate: apply, isPending } = useApplyToCompany();

  const userSkills = user?.skills?.map(s => s.toLowerCase()) || [];
  const hasRequiredSkill = company.jdSkills?.some(skill => userSkills.includes(skill.toLowerCase()));
  const isEligible = user?.cgpa >= company.cgpaCriteria && hasRequiredSkill;


  const handleApply = () => { apply(company._id); };

  const hasApplied = user?.applications?.some(a => a.companyId === company._id) || company.applicants?.some(a => a.studentId === user?._id);
  const deadlineDate = company.applicationDeadline ? new Date(company.applicationDeadline) : null;
  const isExpired = deadlineDate ? Date.now() > deadlineDate.getTime() : false;

  return (
    <div className="glass-card p-6 flex flex-col h-full card interactive">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center border border-neutral-700/50 shadow-inner">
          <Building2 className="w-6 h-6 text-brand-violet" />
        </div>
        <EligibilityBadge isEligible={isEligible} />
      </div>

      <h3 className="text-xl font-bold text-light mb-1">{company.companyName}</h3>
      <p className="text-sm text-brand-violet font-medium mb-4">{company.role}</p>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center text-sm text-neutral-300">
          <DollarSign className="w-4 h-4 mr-2 text-accent-teal" />
          <span>{company.numberOfCandidates ? `${company.numberOfCandidates} Openings` : 'N/A Openings'}</span>
        </div>
        <div className="flex items-center text-sm text-neutral-300">
          <GraduationCap className="w-4 h-4 mr-2 text-accent-gold" />
          <span>{company.cgpaCriteria ? `Requires ${company.cgpaCriteria} CGPA min` : 'No CGPA Constraint'}</span>
        </div>
        {deadlineDate && (
           <div className="flex items-center text-sm">
             <Clock className={cn("w-4 h-4 mr-2", isExpired ? "text-accent-red" : "text-sky-400")} />
             <span className={isExpired ? "text-accent-red font-semibold" : "text-neutral-300"}>
               {isExpired ? "Closed exactly on " : "Closes: "} 
               {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(deadlineDate)}
             </span>
           </div>
        )}
        
        <div className="pt-3">
          <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-semibold">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {company.jdSkills?.slice(0, 3).map((skill, i) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-surface border border-neutral-700/50 text-xs text-light">{skill}</span>
            ))}
            {company.jdSkills?.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-surface border border-neutral-700/50 text-xs text-neutral-500">+{company.jdSkills.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-neutral-700/50">
        <button onClick={() => onClickFeedback(company._id)} className="flex-1 py-2.5 rounded-2xl bg-surface border border-neutral-700/50 text-light text-sm font-medium hover:bg-light/5 interactive">
          View Feedback
        </button>
        {hasApplied ? (
           <button disabled className="flex-1 py-2.5 rounded-2xl bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-sm font-medium transition-all flex items-center justify-center">
             Applied
           </button>
        ) : isExpired ? (
           <button disabled className="flex-1 py-2.5 rounded-2xl bg-accent-red/10 text-accent-red border border-accent-red/20 text-sm font-medium transition-all flex items-center justify-center cursor-not-allowed">
             <AlertCircle className="w-4 h-4 mr-2" />
             Deadline Passed
           </button>
        ) : (
          <button onClick={handleApply} disabled={!isEligible || isPending} className={cn("btn-primary flex-1", !isEligible && "bg-deep text-neutral-500 shadow-none hover:transform-none opacity-80 cursor-not-allowed", isPending && "opacity-70")}>
            {isPending ? 'Applying...' : 'Apply Now'}
            {!isPending && isEligible && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
