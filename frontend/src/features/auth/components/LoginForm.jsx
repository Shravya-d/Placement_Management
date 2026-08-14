import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import { gsap } from '../../../animations/gsap.config';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, X, CheckCircle } from 'lucide-react';
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
  const loginEmail = watch('email');

  // Forgot password modal states
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotRole, setForgotRole] = useState('student');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const handleOpenForgotPassword = () => {
    setForgotEmail(loginEmail || '');
    setForgotRole(selectedRole || 'student');
    setForgotStep(1);
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotSuccessMsg('');
    setIsForgotPasswordOpen(true);
  };

  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Please enter your email.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail, role: forgotRole });
      if (res.success && res.userExists) {
        setForgotStep(2);
      } else {
        setForgotError(res.message || 'No account found with this email.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword || !forgotConfirmPassword) {
      setForgotError('Password fields cannot be empty.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await authApi.resetPassword({
        email: forgotEmail,
        role: forgotRole,
        newPassword: forgotNewPassword
      });
      if (res.success) {
        setForgotStep(3);
      } else {
        setForgotError(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

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
             <button type="button" onClick={handleOpenForgotPassword} className="text-xs font-semibold text-text-muted hover:text-white transition-colors">Forgot password?</button>
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

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-bg-dark/85 backdrop-blur-md"
            onClick={() => {
              if (!forgotLoading) setIsForgotPasswordOpen(false);
            }}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-surface border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-6 text-light animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <button 
                type="button" 
                onClick={() => setIsForgotPasswordOpen(false)} 
                disabled={forgotLoading}
                className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success Alert */}
            {forgotError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotSuccessMsg}</span>
              </div>
            )}

            {/* Step 1: Verify Email and Role */}
            {forgotStep === 1 && (
              <form onSubmit={handleVerifyAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-wider text-text-muted uppercase ml-1 block">Role</label>
                  <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    {['student', 'alumni', 'admin'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForgotRole(role)}
                        className={cn(
                          "py-1.5 text-xs font-bold rounded-lg capitalize transition-all",
                          forgotRole === role 
                            ? "bg-white/10 text-white shadow-sm" 
                            : "text-text-muted hover:text-white"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-xs font-semibold tracking-wider text-text-muted uppercase ml-1 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-text-muted" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="john@college.edu"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted/40 focus:bg-white/10 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-brand-violet to-brand-iris hover:shadow-glow text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center interactive"
                >
                  {forgotLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Verify Account
                </button>
              </form>
            )}

            {/* Step 2: Enter New Password and Confirm */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 mb-4 text-xs space-y-1">
                  <div className="flex justify-between text-text-muted">
                    <span>Account:</span>
                    <span className="text-white font-medium">{forgotEmail}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Role:</span>
                    <span className="text-white font-medium capitalize">{forgotRole}</span>
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-xs font-semibold tracking-wider text-text-muted uppercase ml-1 block">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-text-muted" />
                    </div>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted/40 focus:bg-white/10 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-xs font-semibold tracking-wider text-text-muted uppercase ml-1 block">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-text-muted" />
                    </div>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted/40 focus:bg-white/10 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-brand-violet to-brand-iris hover:shadow-glow text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center interactive"
                >
                  {forgotLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Reset Password
                </button>
              </form>
            )}

            {/* Step 3: Success Message and Close */}
            {forgotStep === 3 && (
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Password Updated Successfully</h4>
                  <p className="text-sm text-text-muted">Please login with your new password.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    // Reset all states
                    setForgotStep(1);
                    setForgotEmail('');
                    setForgotRole('student');
                    setForgotNewPassword('');
                    setForgotConfirmPassword('');
                    setForgotError('');
                    setForgotSuccessMsg('');
                  }}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
