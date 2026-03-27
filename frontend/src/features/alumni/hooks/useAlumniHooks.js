import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '../api/alumniApi';
import { toast } from 'sonner';

export const useAlumniNetwork = () => {
  return useQuery({
    queryKey: ['alumni-network'],
    queryFn: alumniApi.getNetwork
  });
};

export const usePostFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alumniApi.postFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni-network'] }); 
      toast.success('Feedback successfully posted!', {
        className: 'border-l-4 border-l-emerald-500'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post feedback', {
        className: 'border-l-4 border-l-rose-500'
      });
    }
  });
};
