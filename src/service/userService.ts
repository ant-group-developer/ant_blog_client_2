import api from './axios';
import { User } from '@/types';

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const userService = {
  async getUsers(params: GetUsersParams = {}) {
    const { data } = await api.get(`/users`, { params });
    return data;
  },

  async createUser(payload: Partial<User>) {
    const { data } = await api.post(`/users`, payload);
    return data;
  },

  async updateUser(userId: string, payload: Partial<User>) {
    const { data } = await api.patch(`/users/${userId}`, payload);

    return data;
  },

  async deleteUser(userId: string) {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post(`/users/login`, { email, password });

    if (data?.accessToken && data?.data) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      const { setCurrentUser } = (await import('@/store/authStore')).useAuthStore.getState();
      setCurrentUser(data.data);
    }

    return data;
  },
};
