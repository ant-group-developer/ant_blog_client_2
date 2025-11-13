import api from './axios';
import { Category } from '@/types';

interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const categoryService = {
  async getCategories(params: GetCategoriesParams = {}) {
    const { data } = await api.get(`/categories`, { params });
    return data;
  },

  async createCategory(payload: Partial<Category>) {
    const { data } = await api.post(`/categories`, payload);
    return data;
  },

  async updateCategory(categoryId: string | number, payload: Partial<Category>) {
    const { data } = await api.patch(`/categories/${categoryId}`, payload);
    return data;
  },

  async deleteCategory(categoryId: string | number) {
    const { data } = await api.delete(`/categories/${categoryId}`);
    return data;
  },

  async updateOrder(categories: { id: string | number; order: number }[]) {
    // Chuyển tất cả id sang number trước khi gửi
    const payload = categories.map((cat) => ({
      id: Number(cat.id),
      order: cat.order,
    }));

    const { data } = await api.patch(`/categories/order`, payload);
    return data;
  },
};
