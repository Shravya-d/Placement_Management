import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { toast } from 'sonner';

export const useApplyToCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.applyToCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eligible-companies'] });
      // The user object might be cached somewhere but invalidating the company list updates status.
      toast.success('Successfully applied! Good luck.', {
        className: 'border-l-4 border-l-emerald-500'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to apply.', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};
