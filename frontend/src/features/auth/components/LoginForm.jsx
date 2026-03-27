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
    <label className="text-xs font-semibold tracking-wider text-text-muted uppercase ml-1 block">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className={cn("w-4 h-4 transition-colors", error ? "text-rose-500" : "text-text-muted group-focus-within:text-white")} />
      </div>
      <input
        {...register(name)}
        {...props}
        className={cn(
          "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20",
          "transition-all duration-300 backdrop-blur-sm",
          "focus:bg-white/10 focus:outline-none focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]",
          error 
            ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50" 
            : "border-white/10 hover:border-white/20 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
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
       case 'admin': return 'bg-gradient-to-r from-accent-admin to-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]';
       case 'alumni': return 'bg-gradient-to-r from-accent-alumni to-emerald-600 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]';
       default: return 'bg-gradient-to-r from-accent-primary to-indigo-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" ref={formRef}>
      
      <div className="form-element text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h2>
        <p className="text-text-muted text-sm">Securely log in to manage your career journey.</p>
      </div>

      <div className="form-element mb-8 ring-1 ring-white/10 bg-white/5 p-1 rounded-xl flex justify-between relative overflow-hidden">
        {/* Animated toggle background */}
        <div className={cn("absolute inset-y-1 w-[calc(33.33%-4px)] rounded-lg transition-all duration-300 ease-in-out", 
          selectedRole === 'student' ? 'translate-x-[2px] bg-accent-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 
          selectedRole === 'alumni' ? 'translate-x-[calc(100%+4px)] bg-accent-alumni shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
          'translate-x-[calc(200%+6px)] bg-accent-admin shadow-[0_0_20px_rgba(245,158,11,0.4)]')} 
        />
        
        <button type="button" onClick={() => setValue('role', 'student')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors", selectedRole === 'student' ? "text-white" : "text-text-secondary hover:text-white")}>
          Student
        </button>
        <button type="button" onClick={() => setValue('role', 'alumni')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors", selectedRole === 'alumni' ? "text-white" : "text-text-secondary hover:text-white")}>
          Alumni
        </button>
        <button type="button" onClick={() => setValue('role', 'admin')} className={cn("relative z-10 w-1/3 py-2 text-sm font-semibold transition-colors", selectedRole === 'admin' ? "text-white" : "text-text-secondary hover:text-white")}>
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
            "form-element w-full py-3.5 mt-2 rounded-xl text-white text-sm font-bold shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] group",
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
