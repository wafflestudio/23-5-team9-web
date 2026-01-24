import { useState } from 'react';
import { useProducts } from './useProducts';

export function useProductFilterLogic(regionId?: string) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { products, loading, error } = useProducts(undefined, searchQuery, regionId);

  return {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
  };
}
