import { axiosInstance } from '../../../shared/api/axiosInstance';

export const adminApi = {
  addCompany: async (data) => {
    const res = await axiosInstance.post('/placement/companies', data);
    return res.data;
  },
  selectStudents: async ({ companyId, studentIds }) => {
    const res = await axiosInstance.post(`/placement/companies/${companyId}/select`, { studentIds });
    return res.data;
  },
  getCompanyHistory: async () => {
    const res = await axiosInstance.get('/placement/company-history');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.patch('/placement/profile', data);
    return res.data;
  }
};
