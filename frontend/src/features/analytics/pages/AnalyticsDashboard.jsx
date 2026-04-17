import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, 
    LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { Loader2, TrendingUp, Users, Building, Activity, Target } from 'lucide-react';
import { 
    usePlacementRate, useDepartmentsStats, useCompanyStats, 
    useFunnelStats, useTopSkills 
} from '../hooks/useAnalyticsHooks';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const AnalyticsDashboard = () => {
    const { data: rateData, isLoading: rateLoading } = usePlacementRate();
    const { data: deptData, isLoading: deptLoading } = useDepartmentsStats();
    const { data: companyData, isLoading: companyLoading } = useCompanyStats();
    const { data: funnelData, isLoading: funnelLoading } = useFunnelStats();
    const { data: skillsData, isLoading: skillsLoading } = useTopSkills();

    const isLoading = rateLoading || deptLoading || companyLoading || funnelLoading || skillsLoading;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin text-accent-admin" />
                <p className="mt-4">Loading Analytics...</p>
            </div>
        );
    }

    const { total, placedCount, unplacedCount, placementPercentage, yearlyTrends } = rateData?.data || {};
    const departments = deptData?.data?.departments || [];
    const companies = companyData?.data?.companyStats || [];
    const funnel = funnelData?.data?.funnel || [];
    const topSkills = skillsData?.data?.topSkills || [];

    return (
        <div className="min-h-screen bg-bg-dark text-white p-6 md:p-12 space-y-8">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-accent-admin/10 rounded-2xl border border-accent-admin/20">
                    <Activity className="w-8 h-8 text-accent-admin" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-light tracking-tight">Analytics Dashboard</h1>
                    <p className="text-neutral-500 mt-1">Placement metrics and trends at a glance.</p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-2xl font-bold">{placementPercentage}%</span>
                    <span className="text-sm text-text-muted">Placement Rate</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <Users className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-2xl font-bold">{total}</span>
                    <span className="text-sm text-text-muted">Total Students</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <Target className="w-8 h-8 text-amber-400 mb-2" />
                    <span className="text-2xl font-bold">{placedCount}</span>
                    <span className="text-sm text-text-muted">Placed Students</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <Building className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-2xl font-bold">{companies.length}</span>
                    <span className="text-sm text-text-muted">Hiring Companies</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yearly Trends Line Chart */}
                <div className="glass-card p-6 flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Yearly Placement Trends</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yearlyTrends}>
                            <XAxis dataKey="year" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="placed" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Stats Bar Chart */}
                <div className="glass-card p-6 flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Department-wise Selections</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departments}>
                            <XAxis dataKey="department" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="placedStudents" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Application Funnel Pie Chart */}
                <div className="glass-card p-6 flex flex-col h-[400px] items-center">
                    <h3 className="text-lg font-bold mb-4 self-start">Application Funnel</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={funnel}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="stage"
                            >
                                {funnel.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Skills Top Bar Chart */}
                <div className="glass-card p-6 flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Top Skills in Demand</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={topSkills}>
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis dataKey="skill" type="category" stroke="#9ca3af" width={100} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="demand" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
