import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { categoryApi } from '@/lib/api/categories';

export const useCategories = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['categories', page, search],
    queryFn: () => categoryApi.getList(page, search),
  });

  const create = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const remove = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
    page,
    setPage,
    search,
    setSearch,
    create: create.mutate,
    remove: remove.mutate,
  };
};
