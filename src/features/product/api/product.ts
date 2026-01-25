import client from '@/shared/api/client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export interface ProductListParams {
  region?: string;
  seller?: string;
  category?: string;
  search?: string;
}

export const productApi = {
  getList: async (params: ProductListParams = {}, skipAuth = true): Promise<Product[]> => {
    const response = await client.get<Product[]>('/api/product/', {
      params,
      skipAuth,
    } as any);
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/api/product/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await client.post<Product>('/api/product/', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await client.patch<Product>(`/api/product/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/api/product/${id}`);
  },
};
