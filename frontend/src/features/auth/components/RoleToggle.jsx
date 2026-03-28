import React, { useEffect, useRef } from 'react';
import { cn } from '../../../shared/utils/cn';
import { gsap } from '../../../animations/gsap.config';

const roles = [
  { id: 'student', label: 'Student', color: 'bg-brand-violet' },
  { id: 'admin', label: 'Admin', color: 'bg-accent-gold' },
  { id: 'alumni', label: 'Alumni', color: 'bg-accent-teal' }
];

const RoleToggle = ({ selectedRole, onChange }) => {
  const pillRef = useRef(null);

  useEffect(() => {
    const activeIndex = roles.findIndex((r) => r.id === selectedRole);
    if (activeIndex !== -1 && pillRef.current) {
      gsap.to(pillRef.current, {
        x: `${activeIndex * 100}%`,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [selectedRole]);

  return (
    <div className="relative flex items-center p-1 bg-surface rounded-2xl mb-8 isolate overflow-hidden border border-neutral-700/50">
      <div 
        ref={pillRef}
        className={cn(
          "absolute top-1 bottom-1 left-1 rounded-xl z-0 w-[calc(33.33%-0.5rem)] shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
          roles.find(r => r.id === selectedRole)?.color || 'bg-brand-violet'
        )}
      />
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onChange(role.id)}
          className={cn(
            "flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-180 interactive",
            selectedRole === role.id ? "text-light" : "text-neutral-500 hover:text-light"
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;
