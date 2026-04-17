import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../../shared/api/courseApi';

export const useCourses = (skills) => {
    return useQuery({
        queryKey: ['courses', skills],
        queryFn: () => courseApi.getCourses(skills),
        enabled: Array.isArray(skills) && skills.length > 0
    });
};
