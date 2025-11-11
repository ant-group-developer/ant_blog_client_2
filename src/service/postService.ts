import api from './axios';
import { Post } from '@/types';

interface GetPostsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const postService = {
  async getPosts(params: GetPostsParams = {}) {
    const { data } = await api.get(`/posts`, { params });
    return data;
  },

  async createPost(payload: Partial<Post>) {
    const { data } = await api.post(`/posts`, payload);
    return data;
  },

  async updatePost(postId: string | number, payload: Partial<Post>) {
    const { data } = await api.patch(`/posts/${postId}`, payload);
    return data;
  },

  async deletePost(postId: string | number) {
    const { data } = await api.delete(`/posts/${postId}`);
    return data;
  },
};
