import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';

export const useEligibility = (companyId) => {
    return useQuery({
        queryKey: ['eligibility', companyId],
        queryFn: () => studentApi.getCompanyEligibility(companyId),
        enabled: !!companyId
    });
};
