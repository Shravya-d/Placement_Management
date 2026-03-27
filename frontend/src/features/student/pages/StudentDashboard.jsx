import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useEligibleCompanies } from '../hooks/useEligibleCompanies';
import CompanyCard from '../components/CompanyCard';
import FeedbackModal from '../components/FeedbackModal';
import KPICard from '../../../shared/components/KPICard';
import { Building2, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { gsap } from '../../../animations/gsap.config';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { data: companiesData, isLoading } = useEligibleCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const gridRef = useRef(null);

  const companies = companiesData?.data?.companies || [];
  
  const eligibleCount = companies.filter(c => user?.cgpa >= c.cgpaCriteria).length;
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
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center">
          Good morning, {user?.name?.split(' ')[0]} <span className="ml-2 animate-bounce origin-bottom">👋</span>
        </h1>
        <p className="text-text-secondary">Here's your placement summary for this season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Eligible Companies" value={eligibleCount} icon={Building2} colorClass="bg-accent-primary" delay={0.1} />
        <KPICard title="Applications" value={appliedCount} icon={Briefcase} colorClass="bg-accent-admin" delay={0.2} />
        <KPICard title="Status" value={placementStatus} icon={GraduationCap} colorClass={placementStatus === 'PLACED' ? "bg-emerald-500" : "bg-indigo-500"} delay={0.3} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recommended for You</h2>
          <button className="text-accent-primary hover:text-indigo-400 text-sm font-medium flex items-center transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-[16px] bg-gradient-to-r from-surface via-white/5 to-surface animate-pulse border border-border" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} onClickFeedback={setSelectedCompanyId} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-white">No companies available</h3>
            <p className="text-text-muted mt-2 max-w-sm">The placement cell hasn't added any eligible companies. Keep checking back!</p>
          </div>
        )}
      </div>

      <FeedbackModal isOpen={!!selectedCompanyId} onClose={() => setSelectedCompanyId(null)} companyId={selectedCompanyId} />
    </div>
  );
};

export default StudentDashboard;
