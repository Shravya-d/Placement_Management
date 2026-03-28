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
  rejectStudents: async ({ companyId, studentIds }) => {
    const res = await axiosInstance.post(`/placement/companies/${companyId}/reject`, { studentIds });
    return res.data;
  },
  getCompanyApplicants: async () => {
    const res = await axiosInstance.get('/placement/companies/applicants');
    return res.data;
  },
  getCompanyHistory: async () => {
    const res = await axiosInstance.get('/placement/company-history');
    return res.data;
  },
  getActiveDrives: async () => {
    const res = await axiosInstance.get('/placement/active-drives');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.patch('/placement/profile', data);
    return res.data;
  }
};
