export interface Product {
  id: string;
  owner_id: string;
  title: string;
  content: string;
  price: number;
  like_count: number;
  category_id: string;
  region_id: string;
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
  region_id: string;
  is_sold: boolean;
}
