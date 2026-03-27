import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const userData = data.data.user;
      setUser(userData);
      toast.success('Successfully logged in!', {
        className: 'border-l-4 border-l-emerald-500'
      });
      const userRole = userData.role || userData.adminDetails?.role || 'student';
      navigate(`/${userRole}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};

export const useRegisterStudent = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.registerStudent,
    onSuccess: (data) => {
      setUser(data.data.user);
      toast.success('Registration successful! Welcome!', {
        className: 'border-l-4 border-l-emerald-500'
      });
      navigate('/student');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};

export const useRegisterAdmin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.registerAdmin,
    onSuccess: (data) => {
      setUser(data.data.user);
      toast.success('Admin account created. Only one admin account is permitted system-wide.', {
        className: 'border-l-4 border-l-amber-500',
        duration: 8000
      });
      navigate('/admin');
    },
    onError: (error) => {
      if(error.response?.status === 400) {
        toast.error('Admin already exists. Please log in.', {
          className: 'border-l-4 border-l-rose-500'
        });
      } else {
        toast.error(error.response?.data?.message || 'Registration failed', {
          className: 'border-l-4 border-l-rose-500'
        });
      }
    }
  });
};
