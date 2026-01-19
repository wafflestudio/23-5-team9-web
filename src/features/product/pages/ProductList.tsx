import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts, useMyProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { useUser } from '@/features/user/hooks/useUser';
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { Badge, Button, Input, LoginRequired, OnboardingRequired } from '@/shared/ui';
import type { Product } from "@/features/product/api/productApi";

type TabType = 'all' | 'my';

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
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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

interface ProductFiltersProps {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  productCount: number;
  activeTab: TabType;
  onToggleTab: () => void;
}

function ProductFilters({ filterCategory, setFilterCategory, searchQuery, setSearchQuery, productCount, activeTab, onToggleTab }: ProductFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = PRODUCT_CATEGORIES.find(c => c.value === filterCategory)?.label || '전체';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 bg-bg-page pb-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="상품명, 내용 검색"
            className="pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            🔍
          </span>
        </div>

        {/* 나의 상품 버튼 */}
        <Button
          onClick={onToggleTab}
          variant={activeTab === 'my' ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full flex-shrink-0"
        >
          📦  나의 상품
        </Button>

        {/* 카테고리 드롭다운 */}
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            variant={filterCategory !== 'all' ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full flex-shrink-0"
          >
            {selectedLabel} ▾
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-bg-box border border-border-base rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setFilterCategory(cat.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-bg-box-hover ${
                    filterCategory === cat.value ? 'text-primary font-medium' : 'text-text-body'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Badge variant="primary" className="text-sm w-fit px-3 py-1">
        {activeTab === 'my' ? '나의 상품' : '전체 상품'}
        {(filterCategory !== 'all' || searchQuery) && ' · '}
        {filterCategory !== 'all' && selectedLabel}
        {filterCategory !== 'all' && searchQuery && ' · '}
        {searchQuery && `"${searchQuery}"`}
        {' · '}{productCount}개
      </Badge>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

interface ProductContentProps {
  isMyProducts?: boolean;
  activeTab: TabType;
}

function ProductContent({ isMyProducts = false, activeTab }: ProductContentProps) {
  const navigate = useNavigate();
  const { isLoggedIn, needsOnboarding } = useUser();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const handleToggleTab = () => {
    navigate(activeTab === 'all' ? '/products/me' : '/products/all');
  };

  const allProductsQuery = useProducts(filterCategory, searchQuery);
  const myProductsQuery = useMyProducts({ enabled: isMyProducts && isLoggedIn && !needsOnboarding });

  // 내 상품일 경우 클라이언트 필터링 적용
  const filteredMyProducts = myProductsQuery.products.filter(product => {
    if (filterCategory && filterCategory !== 'all') {
      if (product.category_id !== filterCategory) return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = product.title.toLowerCase().includes(query);
      const matchesContent = product.content.toLowerCase().includes(query);
      if (!matchesTitle && !matchesContent) return false;
    }
    return true;
  });

  const { products, loading, error } = isMyProducts
    ? { products: filteredMyProducts, loading: myProductsQuery.loading, error: myProductsQuery.error }
    : allProductsQuery;

  if (isMyProducts) {
    if (!isLoggedIn) {
      return <LoginRequired message="로그인하고 내 상품을 관리하세요" />;
    }
    if (needsOnboarding) {
      return <OnboardingRequired />;
    }
  }

  const filters = (
    <ProductFilters
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      productCount={products.length}
      activeTab={activeTab}
      onToggleTab={handleToggleTab}
    />
  );

  const headerActions = isMyProducts && (
    <div className="flex justify-end mb-4">
      <Button onClick={() => setShowForm(!showForm)} size="sm">
        {showForm ? '취소' : '+ 새 상품 등록'}
      </Button>
    </div>
  );

  return (
    <DataListLayout
      isLoading={loading}
      error={error}
      isEmpty={products.length === 0}
      emptyMessage={searchQuery ? "검색 결과가 없습니다." : isMyProducts ? "등록한 상품이 없습니다." : "등록된 상품이 없습니다."}
      filters={filters}
    >
      {headerActions}
      {showForm && <ProductForm onSuccess={() => setShowForm(false)} />}
      <ProductGrid products={products} />
    </DataListLayout>
  );
}

interface ProductListProps {
  initialTab?: TabType;
}

function ProductList({ initialTab = 'all' }: ProductListProps) {
  return (
    <PageContainer title="중고거래">
      {initialTab === 'all' ? <ProductContent activeTab="all" /> : <ProductContent isMyProducts activeTab="my" />}
    </PageContainer>
  );
}

export default ProductList;
