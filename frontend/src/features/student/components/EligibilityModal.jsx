import React from 'react';
import { X } from 'lucide-react';
import EligibilityScoreCard from './EligibilityScoreCard';

const EligibilityModal = ({ isOpen, onClose, companyId }) => {
    if (!isOpen || !companyId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface shadow-2xl rounded-3xl border border-white/10 animate-fade-in-up">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-xl font-bold text-light">Eligibility Analysis</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-light transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <EligibilityScoreCard companyId={companyId} />
                </div>
            </div>
        </div>
    );
};

export default EligibilityModal;
