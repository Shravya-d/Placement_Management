import React, { useRef, useEffect } from 'react';
import KPICard from '../../../shared/components/KPICard';
import { useCompanyHistory } from '../hooks/useAdminHooks';
import { useAdminStore } from '../store/adminStore';
import { Building2, Users, UserCheck, Percent, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { gsap } from '../../../animations/gsap.config';
import { Link } from 'react-router-dom';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E'];

const AdminDashboard = () => {
  const { data } = useCompanyHistory();
  const { isMatchingAlgorithmRunning } = useAdminStore();
  const chartsRef = useRef(null);

  const history = data?.data?.history || [];
  
  const totalStudents = 320; 
  const companiesAdded = history.length;
  const studentsPlaced = history.reduce((acc, c) => acc + (c.numberOfStudentsPlaced || 0), 0);
  const placementRate = totalStudents > 0 ? Math.round((studentsPlaced / totalStudents) * 100) : 0;

  const barData = history.map(c => ({
    name: c.companyName,
    placed: c.numberOfStudentsPlaced || 0
  })).slice(0, 5);

  const pieData = [
    { name: 'Computer Science', value: 140 },
    { name: 'Information Sci', value: 80 },
    { name: 'Electronics', value: 60 },
    { name: 'Mechanical', value: 40 }
  ];

  useEffect(() => {
    if (chartsRef.current) {
      const charts = chartsRef.current.querySelectorAll('.chart-container');
      gsap.fromTo(charts,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: chartsRef.current, start: "top 85%" } }
      );
    }
  }, []);

  return (
    <div className="space-y-8 relative">
      <style>{`@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
      
      {isMatchingAlgorithmRunning && (
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 flex items-center shadow-lg shadow-indigo-500/10 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-indigo-400" />
          </div>
          <div>
            <h4 className="text-indigo-400 font-bold">Matching Algorithm Running...</h4>
            <p className="text-sm text-indigo-300/80">Analyzing student profiles against new company requirements.</p>
          </div>
          <div className="ml-auto w-1/3 h-1 bg-surface rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 w-full" style={{ animation: 'progress 2s ease-in-out infinite' }} />
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div className="space-y-2">
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-inter">Placement Analytics</h1>
           <p className="text-text-secondary w-full max-w-xl">Overview of placement performance and recent company activities.</p>
        </div>
        <Link to="/admin/companies" className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-accent-admin to-amber-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all">
          <Plus className="w-5 h-5" />
          <span>Add Company</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Students" value={totalStudents} icon={Users} colorClass="bg-accent-primary" delay={0.1} />
        <KPICard title="Companies Visited" value={companiesAdded} icon={Building2} colorClass="bg-accent-admin" delay={0.2} />
        <KPICard title="Students Placed" value={studentsPlaced} icon={UserCheck} colorClass="bg-emerald-500" delay={0.3} />
        <KPICard title="Placement Rate" value={`${placementRate}%`} icon={Percent} colorClass="bg-indigo-500" delay={0.4} />
      </div>

      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container glass-card p-6 h-96">
          <h3 className="text-lg font-bold text-white mb-6">Top Recruiting Companies</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#94A3B8" tick={{ fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0E1219', border: '1px solid #1E2633', borderRadius: '12px' }} />
              <Bar dataKey="placed" fill="#6366F1" radius={[6, 6, 0, 0]} animationBegin={300} animationDuration={1200} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container glass-card p-6 h-96">
          <h3 className="text-lg font-bold text-white mb-6">Department Placement Spread</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" animationBegin={500} animationDuration={1200} animationEasing="ease-out">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0E1219', border: '1px solid #1E2633', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {pieData.map((entry, index) => (
               <div key={`legend-${index}`} className="flex items-center text-xs text-text-muted">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                 {entry.name}
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
