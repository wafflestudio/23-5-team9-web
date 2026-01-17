import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts, useMyProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { useUser } from '@/features/user/hooks/useUser';
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import Badge from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Loading, ErrorMessage, EmptyState, LoginRequired, OnboardingRequired } from '@/shared/ui/StatusMessage';
import { TabBar, Tab } from '@/shared/ui/TabBar';

const formatPrice = (price: number) => price.toLocaleString() + '원';

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
        category_id: '1',
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

function AllProducts() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { products, loading, error } = useProducts(filterCategory);

  const Filters = (
    <div className="flex flex-col gap-3 bg-bg-page pb-2">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {PRODUCT_CATEGORIES.map(category => (
            <Button
              key={category.value}
              variant={filterCategory === category.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilterCategory(category.value)}
              className="whitespace-nowrap rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {filterCategory !== 'all' && (
        <Badge variant="primary" className="text-sm w-fit px-3 py-1">
          {PRODUCT_CATEGORIES.find(c => c.value === filterCategory)?.label}
          {' · '}{products.length}개
        </Badge>
      )}
    </div>
  );

  return (
    <DataListLayout
      isLoading={loading}
      error={error}
      isEmpty={products.length === 0}
      emptyMessage="등록된 상품이 없습니다."
      filters={Filters}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </DataListLayout>
  );
}

function MyProducts() {
  const { isLoggedIn, needsOnboarding } = useUser();
  const { products, loading, error } = useMyProducts({ enabled: isLoggedIn && !needsOnboarding });
  const [showForm, setShowForm] = useState(false);

  if (!isLoggedIn) {
    return <LoginRequired message="로그인하고 내 상품을 관리하세요" />;
  }

  if (needsOnboarding) {
    return <OnboardingRequired />;
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-end mb-4">
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
                  {product.isSold && (
                    <Badge variant="secondary" className="text-xs">판매완료</Badge>
                  )}
                  <span className="text-xs text-text-muted">♡ {product.likeCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

type TabType = 'all' | 'my';

const TABS: Tab<TabType>[] = [
  { id: 'all', label: '전체 상품' },
  { id: 'my', label: '나의 상품' },
];

function ProductList() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <PageContainer title="중고거래 매물">
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'all' ? <AllProducts /> : <MyProducts />}
    </PageContainer>
  );
}

export default ProductList;
