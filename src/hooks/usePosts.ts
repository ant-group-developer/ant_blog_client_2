import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { postApi } from '@/lib/api/posts';

export const usePosts = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [categoryId, setCategoryId] = useQueryState('category_id', parseAsString.withDefault(''));
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['posts', page, search, categoryId],
    queryFn: () => postApi.getList(page, search, categoryId || undefined),
  });

  const create = useMutation({
    mutationFn: postApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });

  const remove = useMutation({
    mutationFn: postApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });

  return {
    data: query.data?.data || [],
    total: query.data?.total || 0,
    page,
    setPage,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    isLoading: query.isLoading,
    create: create.mutate,
    remove: remove.mutate,
  };
};
