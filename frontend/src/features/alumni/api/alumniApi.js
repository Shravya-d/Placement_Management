import { axiosInstance } from '../../../shared/api/axiosInstance';

export const alumniApi = {
  getNetwork: async () => {
    const res = await axiosInstance.get('/alumni/network');
    return res.data;
  },
  postFeedback: async (data) => {
    const res = await axiosInstance.post('/alumni/feedback', data);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.patch('/alumni/profile', data);
    return res.data;
  }
};
