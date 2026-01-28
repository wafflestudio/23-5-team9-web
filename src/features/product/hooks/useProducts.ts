import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { productApi, ProductListParams } from '../api/product';
import { fetchRegionById } from '@/features/location/api/region';
import type { CreateProductRequest, UpdateProductRequest, Product } from '../types';

// Query Keys를 명시적으로 한곳에서 관리
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductListParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// 지역 정보 캐시 (region_id -> { sido, sigugun, dong })
const regionCache: Map<string, { sido: string; sigugun: string; dong: string }> = new Map();

// 지역 정보 가져오기 (캐시 활용)
async function getRegionInfo(regionId: string): Promise<{ sido: string; sigugun: string; dong: string } | null> {
  if (regionCache.has(regionId)) {
    return regionCache.get(regionId)!;
  }
  
  try {
    const region = await fetchRegionById(regionId);
    const info = { sido: region.sido, sigugun: region.sigugun, dong: region.dong };
    regionCache.set(regionId, info);
    return info;
  } catch {
    return null;
  }
}

// 통합된 상품 목록 조회 Hook
export function useProducts(options: { regionId?: string; sido?: string; sigugun?: string; userId?: string; category?: string; search?: string } = {}) {
  const { regionId, sido, sigugun, userId, category, search } = options;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // 동 단위 필터는 서버에서 처리
  const params: ProductListParams = {
    region: regionId,  // 동 단위일 때만 서버 필터 사용
    seller: userId,
    category: category === 'all' ? undefined : category,
    search: search?.trim() || undefined,
  };

  const skipAuth = userId !== 'me';

  const queryInfo = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getList(params, skipAuth),
  });

  // 시/도 또는 시/구/군 필터링 (프론트엔드에서 처리)
  useEffect(() => {
    const filterProducts = async () => {
      const products = queryInfo.data ?? [];
      
      // 동 단위 필터가 있거나, 시/도 필터가 없으면 필터링 불필요
      if (regionId || (!sido && !sigugun)) {
        setFilteredProducts(products);
        setIsFiltering(false);
        return;
      }

      setIsFiltering(true);
      
      // 각 상품의 지역 정보를 가져와서 필터링
      const filtered: Product[] = [];
      
      for (const product of products) {
        const regionInfo = await getRegionInfo(product.region_id);
        if (!regionInfo) continue;
        
        // 시/도 + 시/구/군 필터
        if (sido && sigugun) {
          if (regionInfo.sido === sido && regionInfo.sigugun === sigugun) {
            filtered.push(product);
          }
        }
        // 시/도만 필터
        else if (sido) {
          if (regionInfo.sido === sido) {
            filtered.push(product);
          }
        }
      }
      
      setFilteredProducts(filtered);
      setIsFiltering(false);
    };

    if (!queryInfo.isLoading && queryInfo.data) {
      filterProducts();
    }
  }, [queryInfo.data, queryInfo.isLoading, regionId, sido, sigugun]);

  return {
    products: filteredProducts,
    loading: queryInfo.isLoading || isFiltering,
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
