import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createResource } from '@/shared/lib/createResource';
import client from '@/shared/api/client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';

const productResource = createResource<Product, CreateProductRequest, UpdateProductRequest>(
  '/api/product/',
  'products',
  { skipAuth: true }
);

export const productKeys = productResource.keys;

function filterProducts(products: Product[] | undefined, category?: string, search?: string) {
  if (!products) return [];
  return products.filter(p => {
    if (category && category !== 'all' && p.category_id !== category) return false;
    if (search?.trim()) {
      const q = search.toLowerCase().trim();
      if (!p.title.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

const toResult = (data: Product[] | undefined, isLoading: boolean, error: Error | null, category?: string, search?: string) => ({
  products: filterProducts(data, category, search),
  loading: isLoading,
  error: error?.message ?? null,
});

export function useProductsQuery(options: { regionId?: string; userId?: string; category?: string; search?: string } = {}) {
  const { regionId, userId, category, search } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: userId
      ? [...productKeys.lists(), 'seller', userId]
      : [...productKeys.lists(), 'region', regionId ?? 'all'],
    queryFn: () => {
      const params = userId ? { seller: userId } : regionId ? { region: regionId } : {};
      const skipAuth = userId !== 'me';
      return client.get<Product[]>('/api/product/', { params, skipAuth } as any).then(r => r.data);
    },
    enabled: userId ? !!userId : true,
  });

  return useMemo(() => toResult(data, isLoading, error, category, search), [data, isLoading, error, category, search]);
}

export const useProducts = (category?: string, search?: string, regionId?: string) =>
  useProductsQuery({ regionId, category, search });

export const useUserProducts = (userId: string, category?: string, search?: string) =>
  useProductsQuery({ userId, category, search });

export function useProduct(productId: string) {
  const { data, isLoading, error } = productResource.useDetail(productId);
  return { product: data, loading: isLoading, error: error?.message ?? null };
}

export const useCreateProduct = productResource.useCreate;
export const useUpdateProduct = productResource.useUpdate;
export const useDeleteProduct = productResource.useDelete;
