import { axiosInstance } from '../../../shared/api/axiosInstance';

export const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  registerStudent: async (data) => {
    // Calling the actual backend route
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  registerAdmin: async (data) => {
    const response = await axiosInstance.post('/auth/register-admin', data);
    return response.data;
  }
};
