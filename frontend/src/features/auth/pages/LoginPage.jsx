import React, { useEffect, useRef } from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import { gsap } from '../../../animations/gsap.config';

const LoginPage = () => {
  const leftPanelRef = useRef(null);

  useEffect(() => {
    if (leftPanelRef.current) {
      const elements = leftPanelRef.current.children;
      gsap.fromTo(elements,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.2)" }
      );
    }
  }, []);

  return (
    <AuthLayout>
      <div className="glass-card flex flex-col md:flex-row overflow-hidden min-h-[600px] border-border/50">
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-surface to-surface-raised flex flex-col justify-center relative overflow-hidden border-r border-border/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-admin/10 rounded-full blur-3xl pointer-events-none" />
          
          <div ref={leftPanelRef} className="relative z-10 space-y-8">
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
                <span className="font-bold text-white text-xl">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PlacementSync</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Launch your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-indigo-400">
                Career
              </span> today.
            </h1>

            <p className="text-text-secondary text-lg max-w-md">
              The premium platform bridging top talent from our institution with leading global companies.
            </p>

            <div className="flex space-x-6 pt-8 border-t border-border/50">
              <div>
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-xs text-text-muted mt-1 tracking-wider uppercase font-medium">Placement Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">250+</div>
                <div className="text-xs text-text-muted mt-1 tracking-wider uppercase font-medium">Partner Companies</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex items-center bg-surface/50 backdrop-blur-md relative overflow-y-auto">
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
