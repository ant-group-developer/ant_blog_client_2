import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/service/categoryService';
import { Category } from '@/types';

interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export const useCategories = (params: GetCategoriesParams = {}) => {
  return useQuery({
    queryKey: ['categories', params.page, params.pageSize, params.keyword],
    queryFn: async () => {
      const res = await categoryService.getCategories(params);
      return res.data || []; // Trả về mảng trực tiếp
    },
    staleTime: 1000 * 60,
  });
};

// CREATE CATEGORY
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// UPDATE CATEGORY
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<Category> }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: (res) => {
      const updatedCategory = res.data;

      queryClient.setQueriesData({ queryKey: ['categories'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((c: Category) => (c.id === updatedCategory.id ? updatedCategory : c)),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// DELETE CATEGORY
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// UPDATE CATEGORY ORDER
export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: { id: string | number; order: number }[]) =>
      categoryService.updateOrder(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
