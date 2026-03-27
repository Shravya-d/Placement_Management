import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterStudent, useRegisterAdmin } from '../hooks/useAuth';
import { gsap } from '../../../animations/gsap.config';
import { Link } from 'react-router-dom';
import { 
  Loader2, ChevronRight, ChevronLeft, 
  User, Mail, Phone, Lock, Hash, BookOpen, 
  Award, AlertCircle, Wrench, Link as LinkIcon 
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const studentSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
  usn: z.string().min(3, "USN required"),
  phone: z.string().min(10, "Phone required"),
  branch: z.string().min(2, "Branch required"),
  cgpa: z.coerce.number().min(0).max(10),
  backlogs: z.coerce.number().min(0),
  skills: z.string().transform((val) => val.split(',').map(s => s.trim())),
  resume: z.string().url("Valid URL").optional().or(z.literal(''))
});

const adminSchema = z.object({
  name: z.string().min(2, "Dept Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
  phone: z.string().min(10, "Phone required")
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
          "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20",
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

const RegisterForm = () => {
  const [role, setRole] = useState('student');
  const [step, setStep] = useState(1);
  const formRef = useRef(null);

  const { mutate: regStudent, isPending: isStudentPending } = useRegisterStudent();
  const { mutate: regAdmin, isPending: isAdminPending } = useRegisterAdmin();
  const isPending = isStudentPending || isAdminPending;

  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(role === 'student' ? studentSchema : adminSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('.form-element');
      gsap.fromTo(inputs, 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [step, role]);

  const onSubmit = (data) => {
    role === 'student' ? regStudent(data) : regAdmin(data);
  };

  const nextStep = async () => {
    const isStepValid = await trigger(['name', 'email', 'password', 'phone']);
    if (isStepValid) setStep(2);
  };

  const renderStudentFieldsStep1 = () => (
    <>
      <div className="grid grid-cols-2 gap-4 form-element">
        <CustomInput label="Full Name" name="name" register={register} error={errors.name} placeholder="John Doe" icon={User} />
        <CustomInput label="Phone" name="phone" register={register} error={errors.phone} placeholder="+1234567890" icon={Phone} />
      </div>
      <div className="form-element">
        <CustomInput label="Email Address" type="email" name="email" register={register} error={errors.email} placeholder="john@college.edu" icon={Mail} />
      </div>
      <div className="form-element">
        <CustomInput label="Password" type="password" name="password" register={register} error={errors.password} placeholder="••••••••" icon={Lock} />
      </div>
    </>
  );

  const renderStudentFieldsStep2 = () => (
    <>
      <div className="grid grid-cols-2 gap-4 form-element">
        <CustomInput label="USN" name="usn" register={register} error={errors.usn} placeholder="1XX20CS001" icon={Hash} />
        <CustomInput label="Branch" name="branch" register={register} error={errors.branch} placeholder="Computer Science" icon={BookOpen} />
      </div>
      <div className="grid grid-cols-2 gap-4 form-element">
        <CustomInput label="CGPA" type="number" step="0.01" name="cgpa" register={register} error={errors.cgpa} placeholder="8.50" icon={Award} />
        <CustomInput label="Backlogs" type="number" name="backlogs" register={register} error={errors.backlogs} placeholder="0" icon={AlertCircle} />
      </div>
      <div className="form-element">
        <CustomInput label="Skills (comma separated)" name="skills" register={register} error={errors.skills} placeholder="React, Node.js, Python" icon={Wrench} />
      </div>
      <div className="form-element">
        <CustomInput label="Resume URL" name="resume" register={register} error={errors.resume} placeholder="https://portfolio.com/resume.pdf" icon={LinkIcon} />
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md mx-auto relative" ref={formRef}>
      <div className="form-element text-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Create Account</h2>
        <p className="text-text-muted text-sm">Join the platform to kickstart your career.</p>
      </div>

      <div className="form-element mb-8 ring-1 ring-white/10 bg-white/5 p-1 rounded-xl flex justify-between relative overflow-hidden">
        {/* Animated toggle background */}
        <div className={cn("absolute inset-y-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-in-out", role === 'student' ? 'translate-x-0 bg-accent-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'translate-x-full bg-accent-admin shadow-[0_0_20px_rgba(245,158,11,0.4)]')} />
        
        <button type="button" onClick={() => { setRole('student'); setStep(1); }} className={cn("relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors", role === 'student' ? "text-white" : "text-text-secondary hover:text-white")}>
          Student
        </button>
        <button type="button" onClick={() => { setRole('admin'); setStep(1); }} className={cn("relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors", role === 'admin' ? "text-white" : "text-text-secondary hover:text-white")}>
          Admin Dept
        </button>
      </div>

      {role === 'student' && (
        <div className="form-element flex items-center justify-center space-x-2 mb-6">
           <div className={cn("w-2 h-2 rounded-full transition-colors", step === 1 ? "bg-accent-primary" : "bg-white/20")} />
           <div className={cn("w-6 h-0.5 rounded-full transition-colors", step === 2 ? "bg-accent-primary" : "bg-white/20")} />
           <div className={cn("w-2 h-2 rounded-full transition-colors", step === 2 ? "bg-accent-primary" : "bg-white/20")} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {role === 'student' && step === 1 && renderStudentFieldsStep1()}
        {role === 'student' && step === 2 && renderStudentFieldsStep2()}
        {role === 'admin' && renderStudentFieldsStep1()}

        <div className="form-element pt-4 flex space-x-4">
          {step === 2 && (
            <button type="button" onClick={() => setStep(1)} className="w-[120px] py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
          )}

          {role === 'student' && step === 1 ? (
             <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-xl bg-white text-background text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-zinc-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] flex items-center justify-center group">
               Continue <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-accent-primary" />
             </button>
          ) : (
            <button type="submit" disabled={isPending} className={cn("flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]", role === 'student' ? 'bg-gradient-to-r from-accent-primary to-indigo-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]' : 'bg-gradient-to-r from-accent-admin to-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]', isPending ? "opacity-80 pointer-events-none" : "")}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? 'Processing...' : 'Complete Registration'}
            </button>
          )}
        </div>
        
        <p className="form-element text-center text-sm text-text-muted mt-6 font-medium">
          Already have an account? <Link to="/login" className="text-white hover:text-accent-primary transition-colors hover:underline underline-offset-4 ml-1">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
