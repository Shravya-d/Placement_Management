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
          "w-full bg-light/5 border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-light placeholder:text-light/20",
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

      <div className="form-element mb-8 ring-1 ring-light/10 bg-light/5 p-1 rounded-2xl flex justify-between relative overflow-hidden">
        {/* Animated toggle background */}
        <div className={cn("absolute inset-y-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-in-out", role === 'student' ? 'translate-x-0 bg-brand-violet shadow-[0_0_20px_rgba(123,92,240,0.4)]' : 'translate-x-full bg-accent-gold shadow-[0_0_20px_rgba(245,158,11,0.4)]')} />
        
        <button type="button" onClick={() => { setRole('student'); setStep(1); }} className={cn("relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors interactive", role === 'student' ? "text-light" : "text-neutral-300 hover:text-light")}>
          Student
        </button>
        <button type="button" onClick={() => { setRole('admin'); setStep(1); }} className={cn("relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors interactive", role === 'admin' ? "text-light" : "text-neutral-300 hover:text-light")}>
          Admin Dept
        </button>
      </div>

      {role === 'student' && (
        <div className="form-element flex items-center justify-center space-x-2 mb-6">
           <div className={cn("w-2 h-2 rounded-full transition-colors", step === 1 ? "bg-brand-violet" : "bg-light/20")} />
           <div className={cn("w-6 h-0.5 rounded-full transition-colors", step === 2 ? "bg-brand-violet" : "bg-light/20")} />
           <div className={cn("w-2 h-2 rounded-full transition-colors", step === 2 ? "bg-brand-violet" : "bg-light/20")} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {role === 'student' && step === 1 && renderStudentFieldsStep1()}
        {role === 'student' && step === 2 && renderStudentFieldsStep2()}
        {role === 'admin' && renderStudentFieldsStep1()}

        <div className="form-element pt-4 flex space-x-4">
          {step === 2 && (
            <button type="button" onClick={() => setStep(1)} className="w-[120px] py-3 rounded-2xl bg-light/5 border border-light/10 hover:bg-light/10 text-light text-sm font-semibold transition-all hover:shadow-card flex items-center justify-center group interactive">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
          )}

          {role === 'student' && step === 1 ? (
             <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-2xl bg-light text-void text-sm font-bold shadow-card transition-all hover:bg-light hover:shadow-hover flex items-center justify-center group interactive">
               Continue <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-brand-violet" />
             </button>
          ) : (
            <button type="submit" disabled={isPending} className={cn("flex-1 py-3 rounded-2xl text-light text-sm font-bold shadow-card transition-all flex items-center justify-center interactive group", role === 'student' ? 'bg-gradient-to-r from-brand-violet to-brand-iris hover:shadow-glow' : 'bg-gradient-to-r from-accent-gold to-accent-red hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]', isPending ? "opacity-80 pointer-events-none" : "")}>
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
