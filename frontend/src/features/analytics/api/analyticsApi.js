import { axiosInstance } from '../../../shared/api/axiosInstance';

export const analyticsApi = {
    getPlacementRate: async () => {
        const res = await axiosInstance.get('/analytics/placement-rate');
        return res.data;
    },
    getDepartmentsStats: async () => {
        const res = await axiosInstance.get('/analytics/departments');
        return res.data;
    },
    getCompanyStats: async () => {
        const res = await axiosInstance.get('/analytics/company-stats');
        return res.data;
    },
    getFunnelStats: async () => {
        const res = await axiosInstance.get('/analytics/funnel');
        return res.data;
    },
    getTopSkills: async () => {
        const res = await axiosInstance.get('/analytics/top-skills');
        return res.data;
    }
};
