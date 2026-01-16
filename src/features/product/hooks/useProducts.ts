import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchMyProducts,
  createProduct,
  Product,
} from '@/features/product/api/productApi';

export type { Product, CreateProductRequest } from '@/features/product/api/productApi';

export function useProducts(selectedCategory?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: fetchProducts,
  });

  const filteredProducts = data?.filter((product: Product) => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    return product.categoryId === selectedCategory;
  }) ?? [];

  return {
    products: filteredProducts,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

// 내 상품 목록 조회
export function useMyProducts(options?: { enabled?: boolean }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myProducts'],
    queryFn: fetchMyProducts,
    enabled: options?.enabled ?? true,
  });

  return {
    products: data ?? [],
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}
