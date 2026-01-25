import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, ProductListParams } from '../api/product';
import type { CreateProductRequest, UpdateProductRequest } from '../types';

// Query Keys를 명시적으로 한곳에서 관리
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductListParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// 통합된 상품 목록 조회 Hook
export function useProducts(options: { regionId?: string; userId?: string; category?: string; search?: string } = {}) {
  const { regionId, userId, category, search } = options;

  const params: ProductListParams = {
    region: regionId,
    seller: userId,
    category: category === 'all' ? undefined : category,
    search: search?.trim() || undefined,
  };

  const skipAuth = userId !== 'me';

  const queryInfo = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getList(params, skipAuth),
  });

  return {
    products: queryInfo.data ?? [],
    loading: queryInfo.isLoading,
    error: queryInfo.error as Error | null,
  };
}

// 단일 상품 조회
export function useProduct(productId: string) {
  const queryInfo = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getById(productId),
    enabled: !!productId,
  });

  return {
    product: queryInfo.data,
    loading: queryInfo.isLoading,
    error: queryInfo.error as Error | null,
  };
}

// Mutation Hooks
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productApi.update(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(result.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// 기존 호환성을 위한 alias (필요 없으면 삭제 가능)
export const useUserProducts = (userId: string, category?: string, search?: string) =>
  useProducts({ userId, category, search });
