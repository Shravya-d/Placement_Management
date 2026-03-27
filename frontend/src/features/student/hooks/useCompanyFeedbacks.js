import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';

export const useCompanyFeedbacks = (companyId) => {
  return useQuery({
    queryKey: ['company-feedbacks', companyId],
    queryFn: () => studentApi.getCompanyFeedbacks(companyId),
    enabled: !!companyId,
  });
};
