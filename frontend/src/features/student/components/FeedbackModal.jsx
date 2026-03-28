import React from 'react';
import { useCompanyFeedbacks } from '../hooks/useCompanyFeedbacks';
import { X, Star, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const FeedbackModal = ({ companyId, isOpen, onClose }) => {
  const { data, isLoading } = useCompanyFeedbacks(companyId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-deep border border-neutral-700/50 rounded-2xl w-full max-w-lg shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-neutral-700/50 flex justify-between items-center bg-surface/50">
          <h3 className="text-lg font-bold text-light flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-brand-violet" /> Alumni Feedback
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-500 hover:text-light hover:bg-light/10 transition-colors interactive">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-brand-violet animate-spin mb-4" />
              <p className="text-neutral-500">Loading feedback...</p>
            </div>
          ) : data?.data?.feedbacks?.length > 0 ? (
            <div className="space-y-4">
              {data.data.feedbacks.map((fb, idx) => (
                <div key={idx} className="bg-surface p-4 rounded-xl border border-neutral-700/50">
                  <div className="flex items-center space-x-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={cn("w-4 h-4", star <= fb.rating ? "text-amber-400 fill-amber-400" : "text-deep")} />
                    ))}
                  </div>
                  <p className="text-light text-sm leading-relaxed">&quot;{fb.message}&quot;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto border border-neutral-700/50 mb-4">
                <MessageSquare className="w-6 h-6 text-neutral-500" />
              </div>
              <h4 className="text-light font-medium">No feedback yet</h4>
              <p className="text-sm text-neutral-500 mt-1">Alumni haven't reviewed this company yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
