// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/service/postService';
import { Post } from '@/types';

interface GetPostsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const usePosts = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const res = await postService.getPosts(params);
      return {
        data: res.data || [],
        total: res.pagination?.totalItem || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

// CREATE POST - THÊM MỚI
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Post>) => postService.createPost(payload),
    onSuccess: () => {
      // Invalidate tất cả queries có key 'posts' để refetch data mới
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Create post error:', error);
    },
  });
};
export const usePostById = (postId: string | number, enabled = true) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await postService.getPostById(postId);
      return res;
    },
    enabled: !!postId && enabled, // Chỉ fetch khi có postId
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// UPDATE POST
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<Post> }) =>
      postService.updatePost(Number(id), payload), // Number(id)
    onSuccess: (res) => {
      const updatedPost = res.data;

      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: Post) => (p.id === updatedPost.id ? updatedPost : p)),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
// DELETE POST
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => postService.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Cập nhật cache bằng cách loại bỏ post đã xóa
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((p: Post) => p.id !== deletedId),
          total: old.total - 1,
        };
      });

      // Invalidate để đảm bảo
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
