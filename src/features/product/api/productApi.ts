import client from '@/shared/api/client';

// API 응답 형식
export interface ProductApiResponse {
  id: string;
  owner_id: string;
  title: string;
  content: string;
  price: number;
  like_count: number;
  category_id: string;
  is_sold: boolean;
}

// 프론트엔드용 Product 인터페이스
export interface Product {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  price: number;
  likeCount: number;
  categoryId: string;
  isSold: boolean;
}

// API 응답을 프론트엔드 형식으로 변환
function transformProduct(apiProduct: ProductApiResponse): Product {
  return {
    id: apiProduct.id,
    ownerId: apiProduct.owner_id,
    title: apiProduct.title,
    content: apiProduct.content,
    price: apiProduct.price,
    likeCount: apiProduct.like_count,
    categoryId: apiProduct.category_id,
    isSold: apiProduct.is_sold,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await client.get<ProductApiResponse[]>('/api/product/');
  return response.data.map(transformProduct);
}

// 내 상품 목록 조회
export async function fetchMyProducts(): Promise<Product[]> {
  const response = await client.get<ProductApiResponse[]>('/api/product/me');
  return response.data.map(transformProduct);
}

// 상품 등록 요청 타입
export interface CreateProductRequest {
  title: string;
  content: string;
  price: number;
  category_id: string;
}

// 상품 등록
export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const response = await client.post<ProductApiResponse>('/api/product/me', data);
  return transformProduct(response.data);
}
