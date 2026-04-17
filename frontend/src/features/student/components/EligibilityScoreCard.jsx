import React from 'react';
import { useEligibility } from '../hooks/useEligibility';
import { Loader2, CheckCircle2, XCircle, GraduationCap, Wrench, BookOpen, ExternalLink, Percent } from 'lucide-react';

const CourseRecommendations = ({ recommendedCourses }) => {
    if (!recommendedCourses || recommendedCourses.length === 0) return null;
    return (
        <div className="mt-6 border-t border-white/10 pt-4">
            <h4 className="text-sm font-bold text-light mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-brand-violet" /> 
                Recommended Upskilling
            </h4>
            <div className="space-y-4">
                {recommendedCourses.map(skillCourse => (
                    <div key={skillCourse.skill}>
                        <h5 className="text-xs text-text-muted capitalize mb-2">For {skillCourse.skill}:</h5>
                        <div className="space-y-2">
                            {skillCourse.courses.map((c, i) => (
                                <a 
                                    key={i} 
                                    href={c.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg bg-surface-dark border border-white/5 hover:border-brand-violet/30 transition-colors group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-medium group-hover:text-brand-violet transition-colors">{c.title}</span>
                                        <span className="text-xs text-text-muted mt-0.5">{c.platform} • {c.duration}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-brand-violet transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EligibilityScoreCard = ({ companyId }) => {
    const { data: eligibilityData, isLoading } = useEligibility(companyId);

    if (isLoading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center text-text-muted">
                <Loader2 className="w-8 h-8 animate-spin text-brand-violet" />
                <p className="mt-2 text-sm">Analyzing eligibility...</p>
            </div>
        );
    }

    const breakdown = eligibilityData?.data;

    if (!breakdown) return null;

    const { 
        cgpaScore, matchedSkills, missingSkills, recommendedCourses,
        branchEligible, backlogEligible, requiredCgpa,
        overallMatchPercentage, isEligible
    } = breakdown;

    const totalSkills = matchedSkills.length + missingSkills.length;
    const skillsPercentage = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 100;

    return (
        <div className="glass-card p-6 border-brand-violet/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] mt-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-light flex items-center">
                        <Percent className="w-5 h-5 mr-2 text-brand-violet" /> AI Match Analysis
                    </h3>
                    <p className="text-xs text-text-muted mt-1">Detailed breakdown of your profile fit</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center space-x-2 ${
                    isEligible 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                    {isEligible ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{overallMatchPercentage}% Match</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* CGPA */}
                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-text-muted flex items-center"><GraduationCap className="w-4 h-4 mr-1.5" /> CGPA Fit</span>
                        <span className="font-semibold text-white">{Math.round(cgpaScore * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${cgpaScore >= 1 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ width: `${Math.min(cgpaScore * 100, 100)}%` }}
                        />
                    </div>
                    {requiredCgpa > 0 && <p className="text-[10px] text-text-muted mt-1 text-right">Required: {requiredCgpa}</p>}
                </div>

                {/* Skills */}
                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-text-muted flex items-center"><Wrench className="w-4 h-4 mr-1.5" /> Skills Match</span>
                        <span className="font-semibold text-white">{matchedSkills.length} / {totalSkills}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${skillsPercentage >= 80 ? 'bg-emerald-400' : skillsPercentage >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{ width: `${skillsPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Badges / Factors */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <div className={`px-2.5 py-1 rounded text-xs border ${branchEligible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {branchEligible ? 'Branch Approved' : 'Branch Not Allowed'}
                    </div>
                    <div className={`px-2.5 py-1 rounded text-xs border ${backlogEligible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {backlogEligible ? 'Backlogs Cleared' : 'Active Backlogs Flagged'}
                    </div>
                </div>

                {/* Missing Skills Pills */}
                {missingSkills.length > 0 && (
                    <div className="pt-2">
                        <p className="text-xs text-text-muted mb-2">Missing Required Skills:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {missingSkills.map(s => (
                                <span key={s} className="px-2 py-1 text-[10px] uppercase tracking-wider rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CourseRecommendations recommendedCourses={recommendedCourses} />
        </div>
    );
};

export default EligibilityScoreCard;
