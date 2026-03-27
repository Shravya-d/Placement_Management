import { axiosInstance } from '../../../shared/api/axiosInstance';

export const studentApi = {
  getEligibleCompanies: async () => {
    const res = await axiosInstance.get('/student/eligible-companies');
    return res.data;
  },
  applyToCompany: async (companyId) => {
    const res = await axiosInstance.post(`/student/apply/${companyId}`);
    return res.data;
  },
  getCompanyFeedbacks: async (companyId) => {
    const res = await axiosInstance.get(`/student/company-feedbacks/${companyId}`);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.patch('/student/profile', data);
    return res.data;
  }
};
