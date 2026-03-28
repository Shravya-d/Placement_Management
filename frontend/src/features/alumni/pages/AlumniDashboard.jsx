import React, { useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Briefcase, Building2, Quote, Users, X, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePostFeedback } from '../hooks/useAlumniHooks';
import { cn } from '../../../shared/utils/cn';

const AlumniDashboard = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  
  const { mutate: postFeedback, isPending } = usePostFeedback();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    postFeedback({ message, rating }, {
      onSuccess: () => {
        setShowModal(false);
        setMessage('');
        setRating(5);
      }
    });
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center">
          Welcome back, {user?.studentData?.name || user?.name || 'Alumnus'}
        </h1>
        <p className="text-text-secondary">Your alumni portal. Share your expertise with the next generation.</p>
      </div>

      <div className="glass-card p-8 border-l-4 border-l-accent-alumni shadow-[0_0_40px_rgba(16,185,129,0.1)]">
         <div className="flex items-start md:items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center shrink-0 shadow-inner">
               <Building2 className="w-8 h-8 text-accent-alumni" />
            </div>
            <div>
               <h3 className="text-lg font-medium text-text-muted mb-1 uppercase tracking-widest">Currently Placed At</h3>
               <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-alumni to-emerald-400">
                  {user?.companyJoined || 'Acme Corp'}
               </p>
               <p className="text-white mt-1 font-medium">{user?.role || 'Software Engineer'}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Link to="/alumni/network" className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors border-accent-primary/20 shadow-[0_4px_20px_rgba(99,102,241,0.05)]">
            <div>
              <h4 className="text-lg font-bold text-accent-primary mb-2">My Network</h4>
              <p className="text-sm text-text-muted">Connect with peers mapped to {user?.companyJoined || 'your company'}.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-primary/30 transition-all">
               <Users className="w-6 h-6 text-accent-primary" />
            </div>
         </Link>

         <button onClick={() => setShowModal(true)} className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.05)] text-left w-full focus:outline-none">
            <div>
              <h4 className="text-lg font-bold text-emerald-400 mb-2">Give Feedback</h4>
              <p className="text-sm text-text-muted">Review {user?.companyJoined || 'your company'} for juniors.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
               <Quote className="w-6 h-6 text-emerald-500" />
            </div>
         </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isPending && setShowModal(false)} />
          <div className="relative w-full max-w-lg glass-card p-8 border border-white/10 shadow-2xl animate-fade-in">
            <button 
              onClick={() => setShowModal(false)}
              disabled={isPending}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Review Your Experience</h2>
              <p className="text-text-muted text-sm">Post feedback securely about your time at <span className="text-accent-alumni font-bold">{user?.companyJoined}</span>. This review guides future candidates.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">Interview / Work Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      disabled={isPending}
                      className="focus:outline-none disabled:opacity-50 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={cn(
                          "w-8 h-8 transition-colors", 
                          (hoveredRating ? star <= hoveredRating : star <= rating) 
                            ? "fill-amber-400 text-amber-400" 
                            : "text-white/10 fill-surface"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">Your Feedback</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending}
                  placeholder="Share tips about the interview process, company culture, or specific skills they looked for..."
                  className="w-full h-32 bg-background/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent-alumni/50 focus:border-transparent resize-none disabled:opacity-50 transition-all font-mono text-sm"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isPending || !message.trim()}
                className="w-full h-12 rounded-xl bg-accent-alumni text-white font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Submit Feedback</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;
