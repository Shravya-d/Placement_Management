import React from 'react';
import { Building2, DollarSign, GraduationCap, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import EligibilityBadge from './EligibilityBadge';
import { useAuthStore } from '../../auth/store/authStore';
import { useApplyToCompany } from '../hooks/useApplyToCompany';

const formatStipend = (stipend) => {
  if (!stipend || stipend.trim() === '') return 'N/A';
  let s = stipend.trim();
  if (/^\d+$/.test(s)) {
    return `₹${Number(s).toLocaleString('en-IN')}/month`;
  }
  return s;
};

const formatCTC = (ctc) => {
  if (!ctc || ctc.trim() === '') return 'N/A';
  let c = ctc.trim();
  if (/^\d+(\.\d+)?$/.test(c)) {
    return `${c} LPA`;
  }
  return c;
};

const CompanyCard = ({ company, onClickFeedback, onClickEligibility }) => {
  console.log(company.companyName);
  console.log(company.status);
  const { user } = useAuthStore();
  const { mutate: apply, isPending } = useApplyToCompany();

  const isEligible = company.isEligible;
  const reasons = company.eligibilityReasons || [];


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
        <EligibilityBadge isEligible={isEligible} reasons={reasons} />
      </div>

      <h3 className="text-xl font-bold text-light mb-1">{company.companyName}</h3>
      <p className="text-sm text-brand-violet font-medium mb-4">{company.role}</p>

      <div className="flex items-center space-x-4 mb-4 text-xs bg-surface-dark/40 px-3 py-2 rounded-xl border border-neutral-700/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Stipend</span>
          <span className="text-light font-bold">{formatStipend(company.stipend)}</span>
        </div>
        <div className="w-px h-8 bg-neutral-700/50" />
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">CTC</span>
          <span className="text-light font-bold">{formatCTC(company.ctc)}</span>
        </div>
      </div>

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
        
        {company.matchedSkills && company.matchedSkills.length > 0 ? (
          <div className="pt-3">
            <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-1">Matched Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {company.matchedSkills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">{skill}</span>
              ))}
              {company.matchedSkills.length > 3 && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-400">+{company.matchedSkills.length - 3}</span>
              )}
            </div>
          </div>
        ) : null}

        {company.missingSkills && company.missingSkills.length > 0 ? (
          <div className="pt-3">
            <p className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold mb-1">Missing Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {company.missingSkills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">{skill}</span>
              ))}
              {company.missingSkills.length > 3 && (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-neutral-400">+{company.missingSkills.length - 3}</span>
              )}
            </div>
          </div>
        ) : (!company.matchedSkills && company.jdSkills) ? (
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
        ) : null}

        {!isEligible && reasons.length > 0 && (
          <div className="pt-3 border-t border-neutral-700/30 mt-3">
            <p className="text-[10px] text-accent-red uppercase tracking-wider font-semibold mb-1">Ineligibility Reasons</p>
            <ul className="text-xs text-neutral-400 list-disc list-inside space-y-0.5">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-neutral-700/50">
        <button onClick={() => onClickEligibility(company._id)} className="flex-1 h-11 rounded-2xl bg-surface border border-brand-violet/30 text-brand-violet text-sm font-medium hover:bg-brand-violet/10 interactive flex items-center justify-center transition-all">
          AI Match
        </button>
        <button onClick={() => onClickFeedback(company._id)} className="flex-1 h-11 rounded-2xl bg-surface border border-neutral-700/50 text-light text-sm font-medium hover:bg-light/5 interactive flex items-center justify-center transition-all">
          Reviews
        </button>
        {company.status === 'FILLED' ? (
           <button disabled className="flex-1 h-11 rounded-2xl bg-accent-red/10 text-accent-red border border-accent-red/20 text-sm font-medium transition-all flex items-center justify-center cursor-not-allowed">
             Positions Filled
           </button>
        ) : company.status === 'CLOSED' ? (
           <button disabled className="flex-1 h-11 rounded-2xl bg-accent-red/10 text-accent-red border border-accent-red/20 text-sm font-medium transition-all flex items-center justify-center cursor-not-allowed">
             Closed
           </button>
        ) : hasApplied ? (
           <button disabled className="flex-1 h-11 rounded-2xl bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-sm font-medium transition-all flex items-center justify-center">
             Applied
           </button>
        ) : isExpired ? (
           <button disabled className="flex-1 h-11 rounded-2xl bg-accent-red/10 text-accent-red border border-accent-red/20 text-sm font-medium transition-all flex items-center justify-center cursor-not-allowed">
             <AlertCircle className="w-4 h-4 mr-2" />
             Closed
           </button>
        ) : (
          <button onClick={handleApply} disabled={!isEligible || isPending} className={cn("flex-1 h-11 rounded-2xl text-sm font-bold transition-all flex items-center justify-center interactive", !isEligible ? "bg-surface border border-neutral-700/50 text-neutral-500 cursor-not-allowed opacity-80" : "bg-gradient-to-r from-brand-violet to-indigo-600 text-light shadow-glow hover:shadow-glow-lg", isPending && "opacity-70")}>
            {isPending ? 'Applying...' : 'Apply Now'}
            {!isPending && isEligible && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
