const API = '/mock_api/users';
import { User } from '@/types/index';

export const userApi = {
  //get users,phân trang + tìm kiếm
  getList: (page = 1, search = '') => {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    return fetch(`${API}?${params}`).then((r) => r.json());
  },

  create: (data: Partial<User>) =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  updateSelf: (data: Partial<User>) =>
    fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (email: string, password: string) =>
    fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (r) => {
      if (!r.ok) {
        const error = await r.json();
        throw new Error(error?.message || 'Đăng nhập thất bại');
      }
      return r.json();
    }),

  logout: (userId: string) =>
    fetch(`${API}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId }),
      credentials: 'include',
    }).then((r) => {
      if (!r.ok) throw new Error('Logout failed');
      return r.json();
    }),
};
