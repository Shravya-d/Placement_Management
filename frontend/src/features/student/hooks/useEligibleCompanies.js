import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';

export const useEligibleCompanies = () => {
  return useQuery({
    queryKey: ['eligible-companies'],
    queryFn: studentApi.getEligibleCompanies,
  });
};
