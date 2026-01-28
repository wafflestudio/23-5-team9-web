import client from '@/shared/api/client';
import { MAIN_API_URL } from '@/shared/api/config';
import { useAuthStore } from '@/features/auth/hooks/store';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';
import type { ImageResponse } from '@/shared/api/types';

export interface ProductListParams {
  region?: string;
  sido?: string;
  sigugun?: string;
  seller?: string;
  category?: string;
  search?: string;
}

export const productApi = {
  getList: async (params: ProductListParams = {}, skipAuth = true): Promise<Product[]> => {
    const response = await client.get<Product[]>('/api/product/', {
      params,
      skipAuth,
    });
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

// Image API
export const imageApi = {
  upload: async (file: File): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = useAuthStore.getState().token;
    const response = await fetch(`${MAIN_API_URL}/api/image/product`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
  },

  getById: async (imageId: string): Promise<ImageResponse> => {
    const response = await client.get<ImageResponse>(`/api/image/product/${imageId}`);
    return response.data;
  },

  getImageUrl: (imageId: string): string => {
    // 이미지 태그는 Vite 프록시를 거치지 않으므로 항상 전체 URL 사용
    const baseUrl = MAIN_API_URL || 'https://dev.server.team9-toy-project.p-e.kr';
    return `${baseUrl}/api/image/product/${imageId}`;
  },
};
