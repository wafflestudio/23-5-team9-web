import client from '@/shared/api/client';

export interface Product {
  id: string;
  owner_id: string;
  title: string;
  content: string;
  price: number;
  like_count: number;
  category_id: string;
  is_sold: boolean;
}

export interface CreateProductRequest {
  title: string;
  content: string;
  price: number;
  category_id: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await client.get<Product[]>('/api/product/');
  return response.data;
}

// 내 상품 목록 조회
export async function fetchMyProducts(): Promise<Product[]> {
  const response = await client.get<Product[]>('/api/product/me');
  return response.data;
}

// 상품 등록
export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const response = await client.post<Product>('/api/product/me', data);
  return response.data;
}
