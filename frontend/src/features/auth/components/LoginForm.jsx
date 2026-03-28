import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '../hooks/useAuth';
import { gsap } from '../../../animations/gsap.config';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Passcode required" }),
  role: z.enum(['student', 'admin', 'alumni']),
});

const CustomInput = ({ label, icon: Icon, error, register, name, ...props }) => (
  <div className="space-y-1 w-full">
    <label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase ml-1 block">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className={cn("w-4 h-4 transition-colors", error ? "text-rose-500" : "text-neutral-500 group-focus-within:text-light")} />
      </div>
      <input
        {...register(name)}
        {...props}
        className={cn(
          "w-full bg-light/5 border rounded-2xl pl-10 pr-4 py-3 text-sm text-light placeholder:text-light/20",
          "transition-all duration-300 backdrop-blur-sm",
          "focus:bg-light/10 focus:outline-none focus:shadow-glow",
          error 
            ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50" 
            : "border-light/10 hover:border-light/20 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50"
        )}
      />
    </div>
    {error && (
      <p className="text-rose-400 text-[10px] ml-1 mt-1 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" /> {error.message}
      </p>
    )}
  </div>
);

const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student'
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('.form-element');
      gsap.fromTo(inputs, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const onSubmit = (data) => {
    login(data);
  };

  const getButtonGradient = () => {
    switch(selectedRole) {
       case 'admin': return 'bg-gradient-to-r from-accent-gold to-accent-red hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]';
       case 'alumni': return 'bg-gradient-to-r from-accent-teal to-emerald-600 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]';
       default: return 'bg-gradient-to-r from-brand-violet to-brand-iris hover:shadow-glow';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" ref={formRef}>
      
      <div className="form-element text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h2>
        <p className="text-text-muted text-sm">Securely log in to manage your career journey.</p>
      </div>

      <div className="form-element mb-8 ring-1 ring-light/10 bg-light/5 p-1 rounded-2xl flex justify-between relative overflow-hidden">
        {/* Animated toggle background */}
        <div className={cn("absolute inset-y-1 w-[calc(33.33%-4px)] rounded-xl transition-all duration-300 ease-in-out", 
          selectedRole === 'student' ? 'translate-x-[2px] bg-brand-violet shadow-[0_0_20px_rgba(123,92,240,0.4)]' : 
          selectedRole === 'alumni' ? 'translate-x-[calc(100%+4px)] bg-accent-teal shadow-[0_0_20px_rgba(0,212,170,0.4)]' : 
          'translate-x-[calc(200%+6px)] bg-accent-gold shadow-[0_0_20px_rgba(245,158,11,0.4)]')} 
        />
        
        <button type="button" onClick={() => setValue('role', 'student')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors interactive", selectedRole === 'student' ? "text-light" : "text-neutral-300 hover:text-light")}>
          Student
        </button>
        <button type="button" onClick={() => setValue('role', 'alumni')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors interactive", selectedRole === 'alumni' ? "text-light" : "text-neutral-300 hover:text-light")}>
          Alumni
        </button>
        <button type="button" onClick={() => setValue('role', 'admin')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors interactive", selectedRole === 'admin' ? "text-light" : "text-neutral-300 hover:text-light")}>
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="form-element">
           <CustomInput label="Email Address" type="email" name="email" register={register} error={errors.email} placeholder="john@college.edu" icon={Mail} />
        </div>

        <div className="form-element">
           <CustomInput label="Password" type="password" name="password" register={register} error={errors.password} placeholder="••••••••" icon={Lock} />
           <div className="flex justify-end mt-2">
             <button type="button" className="text-xs font-semibold text-text-muted hover:text-white transition-colors">Forgot password?</button>
           </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "form-element w-full py-3.5 mt-2 rounded-2xl text-light text-sm font-bold transition-all flex items-center justify-center interactive group",
            getButtonGradient(),
            isPending ? "opacity-80 pointer-events-none" : ""
          )}
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {isPending ? 'Authenticating...' : 'Sign In'}
          {!isPending && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform opacity-70" />}
        </button>
        
        <p className="form-element text-center text-sm text-text-muted pt-6 font-medium">
          {selectedRole === 'student' ? (
            <>Ready to launch? <Link to="/register" className="text-white hover:text-accent-primary transition-colors hover:underline underline-offset-4 ml-1">Create an account</Link></>
          ) : selectedRole === 'admin' ? (
            <>New Placement Dept? <Link to="/register" className="text-white hover:text-accent-admin transition-colors hover:underline underline-offset-4 ml-1">Setup Admin</Link></>
          ) : (
            <span>Alumni accounts are created automatically upon placement.</span>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
