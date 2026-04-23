import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi';

export const usePlacementRate = () => useQuery({ queryKey: ['analytics', 'rate'], queryFn: analyticsApi.getPlacementRate, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true });
export const useDepartmentsStats = () => useQuery({ queryKey: ['analytics', 'departments'], queryFn: analyticsApi.getDepartmentsStats });
export const useCompanyStats = () => useQuery({ queryKey: ['analytics', 'companies'], queryFn: analyticsApi.getCompanyStats });
export const useFunnelStats = () => useQuery({ queryKey: ['analytics', 'funnel'], queryFn: analyticsApi.getFunnelStats });
export const useTopSkills = () => useQuery({ queryKey: ['analytics', 'skills'], queryFn: analyticsApi.getTopSkills });
