import React, { useEffect, useRef } from 'react';
import { cn } from '../../../shared/utils/cn';
import { gsap } from '../../../animations/gsap.config';

const roles = [
  { id: 'student', label: 'Student', color: 'bg-accent-primary' },
  { id: 'admin', label: 'Admin', color: 'bg-accent-admin' },
  { id: 'alumni', label: 'Alumni', color: 'bg-accent-alumni' }
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
    <div className="relative flex items-center p-1 bg-surface-raised rounded-xl mb-8 isolate overflow-hidden">
      <div 
        ref={pillRef}
        className={cn(
          "absolute top-1 bottom-1 left-1 rounded-lg z-0 w-[calc(33.33%-0.5rem)] shadow-sm",
          roles.find(r => r.id === selectedRole)?.color || 'bg-accent-primary'
        )}
      />
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onChange(role.id)}
          className={cn(
            "flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-200",
            selectedRole === role.id ? "text-white" : "text-text-muted hover:text-text-primary"
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;
