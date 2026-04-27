import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';

export const useStudentInterviews = (studentId) => {
  return useQuery({
    queryKey: ['student-interviews', studentId],
    queryFn: () => studentApi.getStudentInterviews(studentId),
    enabled: !!studentId
  });
};
