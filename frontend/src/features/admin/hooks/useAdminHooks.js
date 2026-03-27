import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { useAdminStore } from '../store/adminStore';
import { toast } from 'sonner';

export const useAddCompany = () => {
  const queryClient = useQueryClient();
  const setMatching = useAdminStore(s => s.setMatchingAlgorithmRunning);

  return useMutation({
    mutationFn: adminApi.addCompany,
    onMutate: () => {
      setMatching(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-history'] });
      // Visual indicator delay
      setTimeout(() => {
        setMatching(false);
        toast.success('Company added and matching algorithm completed!', {
          className: 'border-l-4 border-l-emerald-500'
        });
      }, 2500);
    },
    onError: (error) => {
      setMatching(false);
      toast.error(error.response?.data?.message || 'Failed to add company', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};

export const useSelectStudents = () => {
  const queryClient = useQueryClient();
  const setSelected = useAdminStore(s => s.setSelectedCompanyForSelection);

  return useMutation({
    mutationFn: adminApi.selectStudents,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-history'] });
      toast.success(`${variables.studentIds.length} students placed! Offer letters sent and migration complete.`, {
        className: 'border-l-4 border-l-emerald-500',
        duration: 5000
      });
      setSelected(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to select students', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};

export const useCompanyHistory = () => {
  return useQuery({
    queryKey: ['company-history'],
    queryFn: adminApi.getCompanyHistory
  });
};
