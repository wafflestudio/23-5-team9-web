import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  fetchProduct, 
  fetchProducts,
  fetchUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  UpdateProductRequest
} from '@/features/product/api/productApi';


export const productKeys = {
  all: ['products'] as const,

  lists: () => [...productKeys.all, 'list'] as const,
  listAll: () => [...productKeys.lists(), 'all'] as const,
  listByRegion: (regionId?: string) => [...productKeys.lists(), 'region', regionId ?? 'all'] as const,
  listBySeller: (userId: string) => [...productKeys.lists(), 'seller', userId] as const,

  details: () => [...productKeys.all, 'detail'] as const,
  detail: (productId: string) => [...productKeys.details(), productId] as const,
};


export function isProductMatched(
  product: Product, 
  selectedCategory?: string, 
  searchQuery?: string
): boolean {

  // 1. 카테고리 필터
  if (selectedCategory && selectedCategory !== 'all') {
    if (product.category_id !== selectedCategory) return false;
  }

  // 2. 검색 필터
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    const matchesTitle = product.title.toLowerCase().includes(query);
    const matchesContent = product.content.toLowerCase().includes(query);
    
    if (!matchesTitle && !matchesContent) return false;
  }
  return true;
}

export function useProducts(selectedCategory?: string, searchQuery?: string, regionId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.listByRegion(regionId),
    queryFn: () => fetchProducts(regionId),
  });

  const filteredProducts = useMemo(() => {
    return data?.filter((product: Product) =>
      isProductMatched(product, selectedCategory, searchQuery)
    ) ?? [];
  }, [data, selectedCategory, searchQuery]);

  return {
    products: filteredProducts,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

export function useUserProducts(user_id: string, selectedCategory?: string, searchQuery?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.listBySeller(user_id), // ['products', 'list', 'seller', user_id]
    queryFn: () => fetchUserProducts(user_id),
    enabled: !!user_id,
  });

  const filteredProducts = useMemo(() => {
    return data?.filter((product: Product) => 
      isProductMatched(product, selectedCategory, searchQuery)
    ) ?? [];
  }, [data, selectedCategory, searchQuery]);

  return {
    products: filteredProducts,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

// 상품 확인
export function useProduct(productId : string) {
  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.detail(productId), // ['products', 'detail', productId]
    queryFn: () => fetchProduct(productId),
  });

  return {
    product: data,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

// 상품 등록
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// 상품 수정
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) => updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // 1. 목록 갱신
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.id) });
    },
  });
}

// 상품 삭제
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}