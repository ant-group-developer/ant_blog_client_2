// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/service/userService';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await userService.getUsers(params);
      return {
        data: res.data || [],
        total: res.pagination?.totalItem || 0,
      };
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      userService.updateUser(id, payload),
    onSuccess: (res) => {
      const updatedUser = res.data;

      // Cập nhật currentUser nếu là chính mình
      const current = useAuthStore.getState().currentUser;
      if (current?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }

      // Cập nhật cache danh sách
      queryClient.setQueriesData({ queryKey: ['users'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((u: User) => (u.id === updatedUser.id ? updatedUser : u)),
        };
      });

      // Invalidate để refetch nếu cần
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
