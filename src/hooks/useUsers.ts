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
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<User> }) => {
      const res = await userService.updateUser(id, payload);

      if (!res.data) {
        const cachedUsers = queryClient.getQueriesData<{ data: User[]; total?: number }>({
          queryKey: ['users'],
        });
        let existingUser: User | null = null;

        for (const [, queryData] of cachedUsers) {
          if (queryData?.data) {
            const found = queryData.data.find((u: User) => u.id === id);
            if (found) {
              existingUser = found;
              break;
            }
          }
        }

        if (!existingUser) {
          const current = useAuthStore.getState().currentUser;
          if (current?.id === id) {
            existingUser = current;
          }
        }

        // Merge payload với user hiện tại
        if (existingUser) {
          const updatedUser: User = {
            ...existingUser,
            ...payload,
            updated_at: new Date().toISOString(),
          };

          return {
            ...res,
            data: updatedUser,
          };
        }
      }

      return res;
    },
    onSuccess: (res) => {
      const updatedUser = res.data;

      if (!updatedUser) {
        //  Nếu không có data, invalidate để refetch
        queryClient.invalidateQueries({ queryKey: ['users'] });
        return;
      }

      const current = useAuthStore.getState().currentUser;
      if (current?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }

      //  Cập nhật cache với optimistic update
      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (old: { data: User[]; total?: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((u: User) => (u.id === updatedUser.id ? updatedUser : u)),
          };
        }
      );

      // Invalidate để đảm bảo data đồng bộ
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Update user failed:', error);
      // Invalidate để refetch data gốc
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
