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

export interface UpdateProductRequest {
  title: string;
  content: string;
  price: number;
  category_id: string;
  is_sold: boolean;
}


export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await client.get<Product[]>('/api/product/');
    return response.data;
  } catch {
    try {
      const response = await client.get<Product[]>('/api/product/me');
      return response.data;
    } catch {
      return [];
    }
  }
}

// 내 상품 목록 조회
export async function fetchMyProducts(): Promise<Product[]> {
  const response = await client.get<Product[]>('/api/product/?seller=me');
  return response.data;
}

// 상품 등록
export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const response = await client.post<Product>('/api/product/', data);
  return response.data;
}

// 상품 수정
export async function updateProduct(product_id: string, data: UpdateProductRequest): Promise<Product> {
  const response = await client.patch<Product>(`/api/product/${product_id}`, data);
  return response.data;
}

// 상품 삭제
export async function deleteProduct(product_id: string): Promise<Product> {
  const response = await client.delete<Product>(`/api/product/${product_id}`, { });
  return response.data;
}
