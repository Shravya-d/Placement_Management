import React, { useState } from 'react';
import { usePlacements } from '../hooks/useAdminHooks';
import { Loader2, Award, Search, Building2, Briefcase, Calendar, GraduationCap } from 'lucide-react';

const PlacementsList = () => {
    const { data: placementsData, isLoading } = usePlacements();
    const [searchTerm, setSearchTerm] = useState('');

    const placements = placementsData?.data?.placements || [];

    const filtered = placements.filter(p => {
        const text = `${p.studentData.name} ${p.companyJoined} ${p.role} ${p.studentData.branch}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin text-accent-gold" />
                <p className="mt-4">Loading placements directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-10">
            <div className="flex items-center space-x-3 mb-6 shrink-0">
                <div className="p-3 bg-accent-gold/10 rounded-2xl border border-accent-gold/20">
                    <Award className="w-8 h-8 text-accent-gold" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-light tracking-tight">Placed Students</h1>
                    <p className="text-neutral-500 mt-1 text-sm">Directory of all students successfully placed.</p>
                </div>
            </div>

            <div className="glass-card p-4 flex items-center space-x-4 border-emerald-500/10">
                <Search className="w-5 h-5 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search by student name, company, role, or branch..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-text-muted text-sm"
                />
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-light border-b border-white/5">
                            <tr className="text-xs uppercase tracking-wider text-text-muted font-bold">
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Branch / CGPA</th>
                                <th className="px-6 py-4">Date Placed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(p => (
                                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">{p.studentData.name}</div>
                                        <div className="text-xs text-text-muted mt-0.5">{p.studentData.usn}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-white">
                                            <Building2 className="w-4 h-4 text-emerald-400" />
                                            <span>{p.companyJoined}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-text-muted bg-surface-dark px-2 py-1 flex-1 rounded text-sm w-max border border-white/5">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            <span>{p.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-text-muted">{p.studentData.branch}</span>
                                            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold w-max border border-emerald-500/20">
                                                <GraduationCap className="w-3 h-3" />
                                                <span>{p.studentData.cgpa}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(p.placedDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                        No placed students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlacementsList;
