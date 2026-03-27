import React from 'react';
import { useCompanyFeedbacks } from '../hooks/useCompanyFeedbacks';
import { X, Star, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const FeedbackModal = ({ companyId, isOpen, onClose }) => {
  const { data, isLoading } = useCompanyFeedbacks(companyId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-surface-raised border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface/50">
          <h3 className="text-lg font-bold text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-accent-primary" /> Alumni Feedback
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-accent-primary animate-spin mb-4" />
              <p className="text-text-muted">Loading feedback...</p>
            </div>
          ) : data?.data?.feedbacks?.length > 0 ? (
            <div className="space-y-4">
              {data.data.feedbacks.map((fb, idx) => (
                <div key={idx} className="bg-surface p-4 rounded-xl border border-border">
                  <div className="flex items-center space-x-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={cn("w-4 h-4", star <= fb.rating ? "text-amber-400 fill-amber-400" : "text-surface-raised")} />
                    ))}
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed">&quot;{fb.message}&quot;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto border border-border mb-4">
                <MessageSquare className="w-6 h-6 text-text-muted" />
              </div>
              <h4 className="text-white font-medium">No feedback yet</h4>
              <p className="text-sm text-text-muted mt-1">Alumni haven't reviewed this company yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
