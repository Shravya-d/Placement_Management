import React, { useState } from 'react';

import { useCompanyApplicants, useSelectStudents, useRejectStudents, useAssignInterview, useUpdateInterviewStatus } from '../hooks/useAdminHooks';
import {
  CheckSquare, ChevronDown, ChevronUp, Loader2, CheckCircle,
  XCircle, FileText, User, Mail, GraduationCap, Building2, Wrench, Calendar, Clock, Video, MapPin
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const SelectionCenter = () => {
  const { data, isLoading } = useCompanyApplicants();
  const { mutate: selectStudents, isPending: isSelecting } = useSelectStudents();
  const { mutate: rejectStudents, isPending: isRejecting } = useRejectStudents();
  const { mutate: assignInterview, isPending: isAssigning } = useAssignInterview();
  const { mutate: updateInterviewStatus, isPending: isUpdatingStatus } = useUpdateInterviewStatus();

  const [expandedId, setExpandedId] = useState(null);
  const [interviewModal, setInterviewModal] = useState({ isOpen: false, companyId: null, studentId: null });
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', mode: 'online', meetingLink: '', location: '' });

  const companies = data?.data?.companies || [];

  const handlePlace = (companyId, studentId) => {
    if (window.confirm("Are you sure you want to mark this applicant as PLACED? They will be migrated to the Alumni list and notified via email.")) {
      selectStudents({ companyId, studentIds: [studentId] });
    }
  };

  const handleReject = (companyId, studentId) => {
    if (window.confirm("Are you sure you want to REJECT this applicant? They will be notified via email.")) {
      rejectStudents({ companyId, studentIds: [studentId] });
    }
  };

  const handleAssignInterview = (e) => {
    e.preventDefault();
    assignInterview({
      studentId: interviewModal.studentId,
      companyId: interviewModal.companyId,
      ...interviewForm
    }, {
      onSuccess: () => {
        setInterviewModal({ isOpen: false, companyId: null, studentId: null });
        setInterviewForm({ date: '', time: '', mode: 'online', meetingLink: '', location: '' });
      }
    });
  };

  const handleMarkCompleted = (companyId, studentId) => {
    if (window.confirm("Mark this interview as completed?")) {
      updateInterviewStatus({ studentId, companyId, status: 'completed' });
    }
  };


  return (
    <div className="space-y-6 mt-10 h-[calc(100vh-[120px])] flex flex-col">
      <div className="flex items-center space-x-3 mb-4 shrink-0">
        <div className="p-3 bg-accent-gold/10 rounded-2xl border border-accent-gold/20">
          <CheckSquare className="w-8 h-8 text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-light tracking-tight">Selection Center</h1>
          <p className="text-neutral-500 mt-1 text-sm">Review applicants, finalize placements, and trigger alumni migration.</p>
        </div>
      </div>


      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-text-muted space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-accent-admin" />
          <p>Loading candidate pipelines...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="glass-card p-12 text-center border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <h3 className="text-xl font-bold text-amber-400">No Pending Applications</h3>
          <p className="text-text-muted mt-2 max-w-lg mx-auto">
            There are currently no active applications pending review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => {
            const isExpanded = expandedId === company._id;
            const activeApplicants = company.applicants.filter(app =>
              ['APPLIED', 'INTERVIEW_SCHEDULED', 'COMPLETED'].includes(app.status)
            );

            return (
              <div key={company._id} className="glass-card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : company._id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="flex items-center space-x-5 text-left">
                    <div className="w-12 h-12 rounded-xl bg-accent-admin/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent-admin" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-accent-admin transition-colors">
                        {company.companyName}
                      </h2>
                      <p className="text-sm text-text-muted mt-1 flex items-center space-x-3">
                        <span>Role: {company.role}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-text-muted/50"></span>
                        <span className="font-semibold text-accent-admin">
                          {activeApplicants.length} Pending Applicant{activeApplicants.length !== 1 && 's'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-light p-2 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 border-t border-white/5" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 bg-surface-dark/50">
                      <div className="overflow-x-auto rounded-xl border border-white/5">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-surface-light/80 border-b border-white/5 text-xs uppercase tracking-wider text-text-muted font-bold">
                              <th className="px-6 py-4">Applicant</th>
                              <th className="px-6 py-4 text-center">CGPA</th>
                              <th className="px-6 py-4 text-center">Skills Matched</th>
                              <th className="px-6 py-4 text-center">Match % (AI)</th>
                              <th className="px-6 py-4 text-center">Resume</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          {/* <tbody className="divide-y divide-white/5">
                            {activeApplicants.map((app) => {
                                const student = app.studentId;
                              return (
                                <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                        {student.name ? student.name.charAt(0).toUpperCase() : <User size={16} />}
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{student.name}</p>
                                        <p className="text-xs text-text-muted flex items-center space-x-1 mt-0.5">
                                          <Mail className="w-3 h-3" />
                                          <span>{student.email}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                      <GraduationCap className="w-3.5 h-3.5" />
                                      <span>{student.cgpa}</span>
                                    </div>
                                    <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{student.branch}</div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                                      <Wrench className="w-4 h-4" />
                                      <span>{app.matchedSkillsCount}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">
                                      <span>{app.semanticScore ?? 0}%</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {student.resume ? (
                                      <a 
                                        href={student.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors tooltip group/btn"
                                        title="View Resume"
                                      >
                                        <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                      </a>
                                    ) : (
                                      <span className="text-xs text-text-muted italic">No Resume</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      {app.status === 'APPLIED' && (
                                        <button
                                          onClick={() => setInterviewModal({ isOpen: true, companyId: company._id, studentId: student._id })}
                                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all flex items-center space-x-1.5"
                                        >
                                          <Calendar className="w-4 h-4" />
                                          <span>Assign Interview</span>
                                        </button>
                                      )}

                                      {app.status === 'INTERVIEW_SCHEDULED' && (
                                        <button
                                          onClick={() => handleMarkCompleted(company._id, student._id)}
                                          disabled={isUpdatingStatus}
                                          className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all flex items-center space-x-1.5"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          <span>Mark Completed</span>
                                        </button>
                                      )}

                                      {app.status === 'COMPLETED' && (
                                        <>
                                          <button
                                            onClick={() => handleReject(company._id, student._id)}
                                            disabled={isRejecting || isSelecting}
                                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <XCircle className="w-4 h-4" />
                                            <span>Reject</span>
                                          </button>
                                          
                                          <button
                                            onClick={() => handlePlace(company._id, student._id)}
                                            disabled={isSelecting || isRejecting}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Place</span>
                                          </button>
                                        </>
                                      )}

                                      {(app.status === 'SELECTED' || app.status === 'REJECTED') && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${app.status === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                          {app.status}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody> */}
                          <tbody className="divide-y divide-white/5">
                            {activeApplicants.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center py-8 text-text-muted">
                                  <div className="flex flex-col items-center justify-center space-y-2">
                                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    <span className="text-sm font-medium">
                                      All candidates have been processed for this company
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                      No pending applicants remaining
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              activeApplicants.map((app) => {
                                const student = app.studentId;

                                return (
                                  <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                          {student.name
                                            ? student.name.charAt(0).toUpperCase()
                                            : <User size={16} />}
                                        </div>
                                        <div>
                                          <p className="text-white font-medium">{student.name}</p>
                                          <p className="text-xs text-text-muted flex items-center space-x-1 mt-0.5">
                                            <Mail className="w-3 h-3" />
                                            <span>{student.email}</span>
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        <span>{student.cgpa}</span>
                                      </div>
                                      <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                                        {student.branch}
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                                        <Wrench className="w-4 h-4" />
                                        <span>{app.matchedSkillsCount}</span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">
                                        <span>{app.semanticScore ?? 0}%</span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      {student.resume ? (
                                        <a
                                          href={student.resume}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        >
                                          <FileText className="w-5 h-5" />
                                        </a>
                                      ) : (
                                        <span className="text-xs text-text-muted italic">
                                          No Resume
                                        </span>
                                      )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      <div className="flex items-center justify-end space-x-2">

                                        {app.status === 'APPLIED' && (
                                          <button
                                            onClick={() =>
                                              setInterviewModal({
                                                isOpen: true,
                                                companyId: company._id,
                                                studentId: student._id
                                              })
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-500/20"
                                          >
                                            Assign Interview
                                          </button>
                                        )}

                                        {app.status === 'INTERVIEW_SCHEDULED' && (
                                          <button
                                            onClick={() =>
                                              handleMarkCompleted(company._id, student._id)
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20"
                                          >
                                            Mark Completed
                                          </button>
                                        )}

                                        {app.status === 'COMPLETED' && (
                                          <>
                                            <button
                                              onClick={() =>
                                                handleReject(company._id, student._id)
                                              }
                                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20"
                                            >
                                              Reject
                                            </button>

                                            <button
                                              onClick={() =>
                                                handlePlace(company._id, student._id)
                                              }
                                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20"
                                            >
                                              Place
                                            </button>
                                          </>
                                        )}

                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Interview Modal */}
      {interviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 max-w-md w-full border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Assign Interview Slot
            </h2>
            <form onSubmit={handleAssignInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Time</label>
                  <input
                    type="time"
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Mode</label>
                <select
                  value={interviewForm.mode}
                  onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {interviewForm.mode === 'online' ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Meeting Link</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/..."
                      value={interviewForm.meetingLink}
                      onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                      className="w-full bg-surface-dark border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      placeholder="Room 101, Placement Block"
                      value={interviewForm.location}
                      onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                      className="w-full bg-surface-dark border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setInterviewModal({ isOpen: false, companyId: null, studentId: null })}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all flex items-center disabled:opacity-50"
                >
                  {isAssigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Assign Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SelectionCenter;
