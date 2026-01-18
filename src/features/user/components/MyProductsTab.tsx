import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyProducts } from '@/features/product/hooks/useProducts';
import { Button, Loading, ErrorMessage, EmptyState, Badge } from '@/shared/ui';

const formatPrice = (price: number) => price.toLocaleString() + '원';

const MyProductsTab = () => {
  const { products, loading, error } = useMyProducts();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">내 상품 목록</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          {showForm ? '취소' : '+ 새 상품 등록'}
        </Button>
      </div>

      {showForm && <ProductForm onSuccess={() => setShowForm(false)} />}

      {products.length === 0 ? (
        <EmptyState message="등록한 상품이 없습니다." />
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="block p-4 border border-border-base rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-text-heading">{product.title}</h4>
                  <p className="text-sm text-text-muted line-clamp-1">{product.content}</p>
                  <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {product.is_sold && (
                    <Badge variant="secondary" className="text-xs">판매완료</Badge>
                  )}
                  <span className="text-xs text-text-muted">♡ {product.like_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// 상품 등록 폼 컴포넌트
import { useCreateProduct } from '@/features/product/hooks/useProducts';

const ProductForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const createProduct = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await createProduct.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        price: Number(price),
        category_id: '1', // 고정값
      });
      alert('상품이 등록되었습니다.');
      onSuccess();
    } catch {
      alert('상품 등록에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border-base rounded-lg bg-bg-elevated">
      <h4 className="font-bold mb-4">새 상품 등록</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border-base rounded-lg bg-bg-page text-text-body focus:outline-none focus:border-primary"
            placeholder="상품 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border-base rounded-lg bg-bg-page text-text-body focus:outline-none focus:border-primary resize-none"
            placeholder="상품 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">가격 (원)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-border-base rounded-lg bg-bg-page text-text-body focus:outline-none focus:border-primary"
            placeholder="가격을 입력하세요"
            min="0"
          />
        </div>

        <Button type="submit" fullWidth disabled={createProduct.isPending}>
          {createProduct.isPending ? '등록 중...' : '상품 등록'}
        </Button>
      </div>
    </form>
  );
};

export default MyProductsTab;
