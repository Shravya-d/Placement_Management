import { axiosInstance } from './axiosInstance';

export const courseApi = {
    getCourses: async (skills) => {
        const query = skills.join(',');
        const res = await axiosInstance.get(`/courses?skills=${query}`);
        return res.data;
    }
};
