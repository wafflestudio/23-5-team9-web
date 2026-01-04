import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  ownerId: number;
  title: string;
  category: string;
  categoryId: number;
  content: string;
  price: number;
  likeCount: number;
  location: string; // Added for UI consistency with PostCard
  imageUrl: string | null; // Added for UI
  createdAt: string; // Added for UI
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    ownerId: 101,
    title: "아이폰 14 프로 맥스 팝니다",
    category: "디지털기기",
    categoryId: 1,
    content: "배터리 효율 90%입니다. 쿨거래시 네고 가능합니다.",
    price: 1200000,
    likeCount: 5,
    location: "서울 강남구 역삼동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: 2,
    ownerId: 102,
    title: "자전거 팝니다",
    category: "스포츠/레저",
    categoryId: 2,
    content: "거의 안 탔습니다. 상태 좋아요.",
    price: 150000,
    likeCount: 2,
    location: "서울 서초구 반포동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-02T11:30:00Z"
  },
  {
    id: 3,
    ownerId: 103,
    title: "원목 식탁 의자 세트",
    category: "가구/인테리어",
    categoryId: 3,
    content: "이사가게 되어 내놓습니다. 직접 가져가셔야 해요.",
    price: 50000,
    likeCount: 10,
    location: "서울 송파구 잠실동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-03T09:15:00Z"
  },
  {
    id: 4,
    ownerId: 104,
    title: "나이키 운동화 270",
    category: "남성패션/잡화",
    categoryId: 4,
    content: "사이즈 미스로 팝니다. 박스 포함 새상품입니다.",
    price: 80000,
    likeCount: 3,
    location: "서울 관악구 신림동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-03T14:20:00Z"
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(MOCK_PRODUCTS);
      } catch (err) {
        setError('상품 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!id) throw new Error('Invalid ID');
        const found = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
        if (!found) throw new Error('Product not found');
        setProduct(found);
      } catch (err) {
        setError('상품을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
