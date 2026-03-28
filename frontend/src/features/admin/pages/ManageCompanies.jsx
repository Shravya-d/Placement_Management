import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCompanyHistory, useAddCompany } from '../hooks/useAdminHooks';
import { gsap } from '../../../animations/gsap.config';
import { 
  Building2, Briefcase, Wrench, Award, 
  MapPin, BookOpen, Users, Calendar, FileText,
  Loader2, AlertCircle, Plus, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

const companySchema = z.object({
  companyName: z.string().min(2, "Name required"),
  role: z.string().min(2, "Role required"),
  jdSkills: z.string().min(1, "Skills required").transform(v => v.split(',').map(s=>s.trim()).filter(Boolean)),
  cgpaCriteria: z.preprocess(v => v === '' ? undefined : Number(v), z.number().min(0).max(10).optional()),
  backlog: z.boolean().default(false),
  branchesAllowed: z.string().min(1, "Branches required").transform(v => v.split(',').map(s=>s.trim()).filter(Boolean)),
  numberOfCandidates: z.preprocess(v => v === '' ? undefined : Number(v), z.number().min(1, "Required").optional()),
  visitDate: z.string().min(1, "Visit date required"),
  applicationDeadline: z.string().min(1, "Deadline required").refine(date => new Date(date).getTime() > Date.now(), { message: "Must be a future date" }),
  description: z.string().min(10, "Description too short")
});

const CustomInput = ({ label, icon: Icon, error, register, name, className, ...props }) => (
  <div className={cn("space-y-1", className)}>
    <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase ml-1 block">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-0 bottom-0">
          <Icon className={cn("w-4 h-4 transition-colors", error ? "text-rose-500" : "text-neutral-500 group-focus-within:text-accent-gold")} />
        </div>
      )}
      {props.type === "textarea" ? (
        <textarea
          {...register(name)}
          {...props}
          className={cn(
            "w-full bg-light/5 border rounded-2xl px-4 py-3 text-sm text-light placeholder:text-light/20",
            "transition-all duration-300 backdrop-blur-sm resize-none min-h-[100px]",
            "focus:bg-light/10 focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            Icon ? "pl-10" : "",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50" 
                  : "border-light/10 hover:border-light/20 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50"
          )}
        />
      ) : props.type === "checkbox" ? (
         <div className="flex items-center h-11 px-4 bg-light/5 border border-light/10 rounded-2xl hover:bg-light/10 transition-colors cursor-pointer" onClick={() => document.getElementById(name).click()}>
            <input 
              id={name}
              type="checkbox" 
              {...register(name)}
              className="w-4 h-4 rounded appearance-none border border-neutral-500 checked:bg-accent-gold checked:border-accent-gold relative checked:after:content-['✓'] checked:after:absolute checked:after:text-light checked:after:text-xs checked:after:left-[3px] checked:after:-top-[1px] transition-all cursor-pointer"
            />
            <span className="ml-3 text-sm text-light font-medium select-none flex-1">Allow Active Backlogs?</span>
         </div>
      ) : (
        <input
          {...register(name)}
          {...props}
          className={cn(
            "w-full bg-light/5 border rounded-2xl px-4 py-2.5 text-sm text-light placeholder:text-light/20",
            "transition-all duration-300 backdrop-blur-sm",
            "focus:bg-light/10 focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            Icon ? "pl-10" : "",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50" 
                  : "border-light/10 hover:border-light/20 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50"
          )}
        />
      )}
    </div>
    {error && (
      <p className="text-rose-400 text-[10px] ml-1 mt-1 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" /> {error.message}
      </p>
    )}
  </div>
);


const ManageCompanies = () => {
  const { data: historyData, isLoading } = useCompanyHistory();
  const { mutate: addCompany, isPending } = useAddCompany();
  const pageRef = useRef(null);
  
  const history = historyData?.data?.history || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      backlog: true
    }
  });

  useEffect(() => {
    if (pageRef.current) {
      const elements = pageRef.current.querySelectorAll('.stagger-item');
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const onSubmit = (data) => {
    addCompany(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="relative mt-10" ref={pageRef}>
      <div className="flex items-center space-x-3 mb-8 stagger-item">
        <div className="p-3 bg-accent-gold/10 rounded-2xl border border-accent-gold/20">
          <Building2 className="w-8 h-8 text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-light tracking-tight">Manage Companies</h1>
          <p className="text-neutral-500 text-sm mt-1">Orchestrate placement drives and define hiring criteria.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List of Companies */}
        <div className="lg:col-span-5 space-y-4 order-2 lg:order-1 stagger-item">
          <h3 className="text-lg font-bold text-light mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-neutral-500" /> Recent Drives
          </h3>
          
          <div className="space-y-4 pr-2 max-h-[800px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              [1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-light/5 animate-pulse border border-neutral-700/50" />)
            ) : history.length > 0 ? (
              history.sort((a,b) => new Date(b.visitDate) - new Date(a.visitDate)).map((company, idx) => (
                <div key={idx} className="bg-surface border border-neutral-700/50 p-5 rounded-2xl hover:border-accent-gold transition-colors interactive group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-accent-gold/10 rounded-bl-2xl">
                    <span className="text-xs font-bold text-accent-gold">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(company.visitDate))}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-light text-lg mr-20">{company.companyName}</h4>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Placed</span>
                      <div className="flex items-center mt-1">
                        <Users className="w-4 h-4 text-emerald-400 mr-1.5" />
                        <span className="text-light font-medium">{company.numberOfStudentsPlaced || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Status</span>
                      <div className="flex items-center mt-1">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-1.5" />
                        <span className="text-light font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                  
                  {company.feedbacks && company.feedbacks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-700/50 text-xs text-neutral-300">
                      {company.feedbacks.length} reviews from placed alumni
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-card p-8 text-center border-dashed border-neutral-700/50">
                <Building2 className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium">No drives configured yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add Form */}
        <div className="lg:col-span-7 order-1 lg:order-2 stagger-item">
          <div className="relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold/30 to-accent-red/30 rounded-[28px] blur-xl opacity-60" />
            
            <div className="relative bg-surface border border-neutral-700/50 shadow-card rounded-[24px] p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-gold via-accent-gold to-accent-red" />
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-light flex items-center">
                   <Plus className="w-6 h-6 mr-2 text-accent-gold" /> Create New Drive
                </h2>
                <p className="text-sm text-neutral-500 mt-1">Configure company requirements and trigger the automated matching instantly.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CustomInput label="Company Name" name="companyName" register={register} error={errors.companyName} placeholder="Acme Corp" icon={Building2} />
                  <CustomInput label="Job Role" name="role" register={register} error={errors.role} placeholder="Software Engineer" icon={Briefcase} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CustomInput label="Visit Date" type="date" name="visitDate" register={register} error={errors.visitDate} icon={Calendar} />
                  <CustomInput label="App Deadline" type="datetime-local" name="applicationDeadline" register={register} error={errors.applicationDeadline} icon={Clock} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                  <CustomInput label="Number of Candidates Required" type="number" name="numberOfCandidates" register={register} error={errors.numberOfCandidates} placeholder="Waitlist size (e.g. 10)" icon={Users} />
                  <CustomInput label="Minimum CGPA" type="number" step="0.01" name="cgpaCriteria" register={register} error={errors.cgpaCriteria} placeholder="7.50" icon={Award} />
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <CustomInput label="Backlogs Rule" type="checkbox" name="backlog" register={register} error={errors.backlog} />
                </div>

                <div className="space-y-5 pt-2">
                  <CustomInput label="Required Skills (comma separated)" name="jdSkills" register={register} error={errors.jdSkills} placeholder="React, Node.js, System Design" icon={Wrench} />
                  
                  <CustomInput label="Allowed Branches (comma separated)" name="branchesAllowed" register={register} error={errors.branchesAllowed} placeholder="CSE, ISE, ECE" icon={BookOpen} />
                  
                  <CustomInput label="Job Description" type="textarea" name="description" register={register} error={errors.description} placeholder="Detailed roles and responsibilities..." icon={FileText} />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                      "w-full py-4 rounded-2xl text-light font-bold shadow-card flex items-center justify-center interactive group",
                      "bg-gradient-to-r from-accent-gold to-accent-red hover:shadow-glow",
                      isPending ? "opacity-80 pointer-events-none" : ""
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    )}
                    {isPending ? 'Executing Matching Algorithm...' : 'Deploy Placement Drive'}
                  </button>
                  <p className="text-center text-[11px] text-neutral-500 mt-4 font-medium uppercase tracking-wide">
                    Submitting will immediately map eligible students to this drive.
                  </p>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
