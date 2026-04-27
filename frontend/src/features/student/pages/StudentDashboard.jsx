import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useEligibleCompanies } from '../hooks/useEligibleCompanies';
import { useStudentInterviews } from '../hooks/useStudentInterviews';
import CompanyCard from '../components/CompanyCard';
import FeedbackModal from '../components/FeedbackModal';
import EligibilityModal from '../components/EligibilityModal';
import KPICard from '../../../shared/components/KPICard';
import { Building2, Briefcase, GraduationCap, ArrowRight, Calendar, Clock, Video, MapPin, Loader2 } from 'lucide-react';
import { gsap } from '../../../animations/gsap.config';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { data: companiesData, isLoading } = useEligibleCompanies();
  const { data: interviewsData, isLoading: isLoadingInterviews } = useStudentInterviews(user?._id);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedEligibilityId, setSelectedEligibilityId] = useState(null);
  const gridRef = useRef(null);

  const companies = companiesData?.data?.companies || [];
  const interviews = interviewsData?.data?.interviews || [];
  

  const userSkills = user?.skills?.map(s => s.trim().toLowerCase()) || [];
  const userBranch = (user?.branch || '').trim().toLowerCase();
  
  const eligibleCount = companies.filter(c => {
    const hasRequiredSkill = c.jdSkills?.some(skill => userSkills.includes(skill.trim().toLowerCase()));
    const hasAllowedBranch = !c.branchesAllowed || c.branchesAllowed.length === 0 || c.branchesAllowed.some(b => b.trim().toLowerCase() === userBranch);
    const hasNoBacklogsIfRequired = c.backlog === false ? !user?.backlogs : true;
    return parseFloat(user?.cgpa || 0) >= parseFloat(c.cgpaCriteria || 0) && hasRequiredSkill && hasAllowedBranch && hasNoBacklogsIfRequired;
  }).length;

  const appliedCount = user?.applications?.length || 0;
  const placementStatus = user?.placementStatus || 'Active';

  useEffect(() => {
    if (gridRef.current && companies.length > 0) {
      const cards = gridRef.current.querySelectorAll('.card');
      gsap.fromTo(cards, 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: gridRef.current, start: "top 85%" } }
      );
    }
  }, [companies.length]);

  return (
    <div className="space-y-8 mt-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-light flex items-center">
          Good morning, {user?.name?.split(' ')[0]} <span className="ml-2 animate-bounce origin-bottom">👋</span>
        </h1>
        <p className="text-neutral-300">Here's your placement summary for this season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <KPICard title="Eligible Companies" value={eligibleCount} icon={Building2} colorClass="bg-brand-violet" delay={0.1} />
        <KPICard title="Applications" value={appliedCount} icon={Briefcase} colorClass="bg-accent-gold" delay={0.2} />
        <KPICard title="Status" value={placementStatus} icon={GraduationCap} colorClass={placementStatus === 'PLACED' ? "bg-accent-teal" : "bg-brand-iris"} delay={0.3} />
      </div>

      {/* Interview Details Section */}
      <div className="space-y-6 mt-16">
        <h2 className="text-2xl font-bold text-light tracking-tight flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-400" />
          Interview Details
        </h2>
        
        {isLoadingInterviews ? (
          <div className="h-32 flex flex-col items-center justify-center text-text-muted space-y-4 glass-card border-white/5">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p>Loading your interviews...</p>
          </div>
        ) : interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <div key={interview._id} className="glass-card p-6 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{interview.companyName}</h3>
                    <p className="text-sm text-text-muted">{interview.role}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    interview.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    interview.status === 'completed' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    interview.status === 'selected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-neutral-300">
                    <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                    {new Date(interview.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-sm text-neutral-300">
                    <Clock className="w-4 h-4 mr-2 text-text-muted" />
                    {interview.time}
                  </div>
                  
                  {interview.mode === 'online' ? (
                    <div className="flex items-start text-sm text-neutral-300">
                      <Video className="w-4 h-4 mr-2 text-text-muted mt-0.5 shrink-0" />
                      {interview.meetingLink ? (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                          {interview.meetingLink}
                        </a>
                      ) : (
                        <span className="italic">Link pending</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start text-sm text-neutral-300">
                      <MapPin className="w-4 h-4 mr-2 text-text-muted mt-0.5 shrink-0" />
                      <span className="break-words">{interview.location || 'Location pending'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center border-white/5">
            <div className="w-12 h-12 rounded-full bg-surface border border-neutral-700/50 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-neutral-500" />
            </div>
            <p className="text-text-muted text-sm">You have no interviews scheduled at the moment.</p>
          </div>
        )}
      </div>

      <div className="space-y-6 mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-light tracking-tight">Recommended for You</h2>
          <button className="text-brand-violet hover:text-brand-lavender text-sm font-medium flex items-center transition-colors interactive">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-gradient-to-r from-surface via-light/5 to-surface animate-pulse border border-neutral-700/50" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard 
                  key={company._id} 
                  company={company} 
                  onClickFeedback={setSelectedCompanyId} 
                  onClickEligibility={setSelectedEligibilityId}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface border border-neutral-700/50 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-light">No companies available</h3>
            <p className="text-neutral-500 mt-2 max-w-sm">The placement cell hasn't added any eligible companies. Keep checking back!</p>
          </div>
        )}
      </div>

      <FeedbackModal isOpen={!!selectedCompanyId} onClose={() => setSelectedCompanyId(null)} companyId={selectedCompanyId} />
      <EligibilityModal isOpen={!!selectedEligibilityId} onClose={() => setSelectedEligibilityId(null)} companyId={selectedEligibilityId} />
    </div>
  );
};

export default StudentDashboard;
