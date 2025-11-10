import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { userApi } from '@/lib/api/users';

export const useUsers = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => userApi.getList(page, search),
  });

  const create = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    data: query.data?.data || [],
    total: query.data?.total || 0,
    page,
    setPage,
    search,
    setSearch,
    isLoading: query.isLoading,
    create: create.mutate,
  };
};
