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
    return client
      .get('/api/product/', { searchParams: params, skipAuth } as any)
      .json<Product[]>();
  },

  getById: async (id: string): Promise<Product> => {
    return client.get(`/api/product/${id}`).json<Product>();
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    return client.post('/api/product/', { json: data }).json<Product>();
  },

  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    return client.patch(`/api/product/${id}`, { json: data }).json<Product>();
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/api/product/${id}`);
  },
};
