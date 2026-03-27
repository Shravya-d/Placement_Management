import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated abstract gradient mesh background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-admin/10 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      
      <div className="z-10 w-full max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
