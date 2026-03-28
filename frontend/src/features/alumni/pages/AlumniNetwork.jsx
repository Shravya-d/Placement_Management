import React, { useRef, useEffect } from 'react';
import { useAlumniNetwork } from '../hooks/useAlumniHooks';
import { Users, Phone, Briefcase } from 'lucide-react';
import { gsap } from '../../../animations/gsap.config';

const AlumniNetwork = () => {
  const { data, isLoading } = useAlumniNetwork();
  const gridRef = useRef(null);

  const network = data?.data?.alumniList || [];

  useEffect(() => {
    if (gridRef.current && network.length > 0) {
       const cards = gridRef.current.querySelectorAll('.alumni-card');
       gsap.fromTo(cards, 
         { y: 40, opacity: 0 }, 
         { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
       );
    }
  }, [network.length]);

  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-accent-teal/10 rounded-2xl border border-accent-teal/20">
          <Users className="w-8 h-8 text-accent-teal" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-light tracking-tight">Alumni Network</h1>
          <p className="text-neutral-500 text-sm mt-1">Connect with placed peers.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-2xl bg-gradient-to-r from-surface via-deep to-surface border border-neutral-700/50 animate-pulse" />)}
        </div>
      ) : network.length > 0 ? (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {network.map((alumnus) => (
             <div key={alumnus._id} className="alumni-card glass-card p-6 group interactive border-t-2 border-t-accent-teal/50">
                <div className="flex items-center space-x-4 mb-4 border-b border-neutral-700/50 pb-4">
                   <div className="w-12 h-12 rounded-full bg-deep border border-neutral-700/50 flex items-center justify-center text-lg font-bold text-light shadow-sm shadow-accent-teal/20">
                     {alumnus.studentData?.name?.charAt(0) || 'A'}
                   </div>
                   <div>
                     <h3 className="text-light font-bold">{alumnus.studentData?.name}</h3>
                     <p className="text-xs text-neutral-500">{alumnus.studentData?.email}</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center text-sm">
                      <Briefcase className="w-4 h-4 mr-2 text-accent-teal" />
                      <span className="text-emerald-400 font-medium">{alumnus.companyJoined}</span>
                      <span className="text-neutral-500 ml-2">{alumnus.role && `(${alumnus.role})`}</span>
                   </div>
                   <div className="flex items-center text-sm text-neutral-300">
                      <Phone className="w-4 h-4 mr-2 text-neutral-500" />
                      {alumnus.studentData?.phone || 'N/A'}
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center max-w-lg mx-auto border-dashed border-neutral-700/50">
           <Users className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
           <p className="text-neutral-500">No other alumni found in your network.</p>
        </div>
      )}
    </div>
  );
};

export default AlumniNetwork;
