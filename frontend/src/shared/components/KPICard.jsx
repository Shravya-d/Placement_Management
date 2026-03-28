import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { gsap } from '../../animations/gsap.config';

const KPICard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => {
  const cardRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    if (cardRef.current && counterRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay, ease: "power2.out", scrollTrigger: { trigger: cardRef.current, start: "top 90%" } }
      );

      const isNumeric = !isNaN(Number(value));

      if (isNumeric) {
        gsap.to(counterRef.current, {
          textContent: value,
          duration: 2,
          snap: { textContent: 1 },
          ease: "power2.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 90%" }
        });
      } else {
        counterRef.current.textContent = value;
      }
    }
  }, [value, delay]);

  return (
    <div ref={cardRef} className="glass-card p-6 relative overflow-hidden group interactive">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-light/5 group-hover:bg-light/10 transition-colors pointer-events-none blur-2xl" />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-300 tracking-wider uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-light mt-2 font-sans tracking-tight">
            <span ref={counterRef}>0</span>
          </h3>
        </div>
        <div className={cn("p-3 rounded-2xl", colorClass)}>
          <Icon className="w-6 h-6 text-light" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
