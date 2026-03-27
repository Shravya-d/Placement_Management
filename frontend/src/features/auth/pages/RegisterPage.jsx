import React, { useEffect, useRef } from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';
import { gsap } from '../../../animations/gsap.config';

const RegisterPage = () => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      const elements = panelRef.current.children;
      gsap.fromTo(elements,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <AuthLayout>
      <div className="glass-card flex flex-col md:flex-row-reverse overflow-hidden min-h-[650px] border-border/50">
        <div className="md:w-5/12 p-8 md:p-12 bg-gradient-to-b from-surface-raised via-surface to-background flex flex-col justify-center relative border-l border-border/30">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent-primary/10 rounded-full blur-[80px] pointer-events-none" />

          <div ref={panelRef} className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">Your gateway to the professional world.</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-white">Create Profile</h4>
                  <p className="text-sm text-text-muted mt-1">Add your CGPA, branch, and technical skills.</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-white">Algorithm Match</h4>
                  <p className="text-sm text-text-muted mt-1">Our system matches you with right companies.</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-white">Get Placed</h4>
                  <p className="text-sm text-text-muted mt-1">One-click apply and automated offer tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-10 flex items-center bg-surface/50 backdrop-blur-md relative">
          <RegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
