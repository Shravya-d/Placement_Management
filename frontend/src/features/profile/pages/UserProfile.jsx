import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../auth/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { studentApi } from '../../student/api/studentApi';
import { adminApi } from '../../admin/api/adminApi';
import { alumniApi } from '../../alumni/api/alumniApi';
import { MapPin, Phone, Mail, User, Briefcase, FileText, Loader2, Save, UserCheck, Building2 } from 'lucide-react';
import { toast } from 'sonner';

// Simplified CustomInput component for Profile usage
const CustomInput = ({ label, register, name, error, icon: Icon, disabled, type = "text", ...rest }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-semibold text-neutral-300 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-neutral-500" />
      </div>
      <input
        type={type}
        {...register(name)}
        disabled={disabled}
        className={`block w-full pl-10 pr-4 py-3 border border-neutral-700/50 rounded-2xl bg-light/5 text-light placeholder:text-neutral-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 backdrop-blur-sm transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-500'}`}
        {...rest}
      />
    </div>
    {error && <span className="text-xs text-rose-500 mt-1">{error.message}</span>}
  </div>
);

const UserProfile = () => {
  const { user, role, setUser } = useAuthStore();
  
  const initialValues = {
    name: user?.name || user?.adminDetails?.name || user?.studentData?.name || '',
    email: user?.email || user?.adminDetails?.email || user?.studentData?.email || '',
    phone: user?.phone || user?.adminDetails?.phone || user?.studentData?.phone || '',
    branch: user?.branch || user?.studentData?.branch || '',
    skills: Array.isArray(user?.skills || user?.studentData?.skills) ? (user?.skills || user?.studentData?.skills).join(', ') : '',
    resume: user?.resume || user?.studentData?.resume || '',
    companyJoined: user?.companyJoined || '',
    jobRole: user?.role || '' // alumni role
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  const getApiMethod = () => {
    if (role === 'admin') return adminApi.updateProfile;
    if (role === 'alumni') return alumniApi.updateProfile;
    return studentApi.updateProfile;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: getApiMethod(),
    onSuccess: (data) => {
      setUser(data.data.user);
      toast.success('Profile updated successfully!', {
        className: 'border-l-4 border-l-emerald-500'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile', {
          className: 'border-l-4 border-l-rose-500'
      });
    }
  });

  const onSubmit = (data) => {
    const payload = { ...data };
    if (payload.skills) {
      payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    // Prevent email overriding just to be safe
    delete payload.email;
    
    mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 lg:py-12 px-4 sm:px-6">
      <div className="glass-card overflow-hidden shadow-card border-t border-t-neutral-700/50">
        <div className="bg-gradient-to-r from-brand-violet to-brand-iris px-8 py-8 flex items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-light/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-full bg-light/10 flex items-center justify-center border border-light/20 shadow-xl backdrop-blur-md shrink-0 relative z-10">
             <UserCheck className="w-10 h-10 text-light" />
          </div>
          <div className="ml-6 relative z-10">
            <h1 className="text-3xl font-bold text-light tracking-tight">Profile Settings</h1>
            <p className="text-brand-mist/80 mt-1.5 text-sm font-semibold tracking-wider">
               {role ? role.toUpperCase() : 'USER'} ACCOUNT
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <CustomInput label="Full Name" name="name" register={register} icon={User} error={errors.name} />
            <CustomInput label="Email Address" name="email" register={register} icon={Mail} disabled={true} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <CustomInput label="Phone Number" name="phone" register={register} icon={Phone} error={errors.phone} />
            {(role === 'student' || role === 'alumni') && (
              <CustomInput label="Branch" name="branch" register={register} icon={MapPin} disabled={role === 'alumni'} />
            )}
          </div>

          {(role === 'student' || role === 'alumni') && (
            <>
              <CustomInput label="Skills (comma separated)" name="skills" register={register} icon={Briefcase} />
              <CustomInput label="Resume External Link" name="resume" register={register} icon={FileText} />
            </>
          )}

          {role === 'alumni' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <CustomInput label="Current Company" name="companyJoined" register={register} icon={Building2} />
              <CustomInput label="Designation" name="jobRole" register={register} icon={Briefcase} />
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-neutral-700/50 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="btn-primary interactive"
            >
              {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              {isPending ? 'Saving Details...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
