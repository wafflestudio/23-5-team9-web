import { useState, useRef, useEffect } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts, useMyProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { useUser } from '@/features/user/hooks/useUser';
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { Button, Input, LoginRequired, OnboardingRequired, TabBar } from '@/shared/ui';
import type { Tab } from '@/shared/ui';
import type { Product } from "@/features/product/api/productApi";

type TabType = 'all' | 'my';

const PRODUCT_TABS: Tab<TabType>[] = [
  { id: 'all', label: '전체 상품', to: '/products/all' },
  { id: 'my', label: '나의 상품', to: '/products/me' },
];

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
    // 수정: bg-bg-elevated -> bg-bg-box-light (index.css 토큰 사용)
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border-base rounded-lg bg-bg-box-light">
      <h4 className="font-bold mb-4 text-text-heading">새 상품 등록</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-text-primary">제목</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="상품 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text-primary">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border-base rounded-lg bg-bg-page text-text-body focus:outline-none focus:border-primary resize-none placeholder:text-text-placeholder"
            placeholder="상품 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text-primary">가격 (원)</label>
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
  activeTab: TabType;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}

function ProductFilters({ filterCategory, setFilterCategory, searchQuery, setSearchQuery, activeTab, showForm, setShowForm }: ProductFiltersProps) {
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
    <div className="flex flex-col bg-bg-page">
      <TabBar tabs={PRODUCT_TABS} activeTab={activeTab} />

      {/* mx-auto와 w-fit으로 검색바를 중앙 정렬 */}
      <div className="relative flex justify-center items-center mb-6 w-fit mx-auto" ref={dropdownRef}>
        
        {/* 검색바 컨테이너 */}
        {/* 수정: bg-white -> bg-bg-page (다크모드 대응) */}
        <div className="flex items-center bg-bg-page rounded-lg border border-border-base overflow-hidden transition-shadow">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-4 py-3 text-base font-bold text-text-body hover:bg-bg-box-light transition-colors whitespace-nowrap"
          >
            {selectedLabel} 
            <span className={`text-[10px] text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <div className="w-px h-4 bg-border-base" />

          <div className="flex items-center px-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="py-3 text-base font-medium outline-none bg-transparent min-w-[300px] text-text-primary placeholder:text-text-secondary/50"
            />
          </div>
        </div>

        {/* 1 & 2 개선: 위치를 left-0, 너비를 w-full로 맞추고 스크롤 가능하게 변경 */}
        {isDropdownOpen && (
          // 수정: bg-white -> bg-bg-page (다크모드 대응)
          <div className="absolute left-0 top-[calc(100%+4px)] w-full bg-bg-page border border-border-base rounded-lg z-50 overflow-hidden shadow-lg">
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setFilterCategory(cat.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    filterCategory === cat.value 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-text-body hover:bg-bg-box-light'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 새 상품 등록 버튼 생략 */}
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
  const { isLoggedIn, needsOnboarding } = useUser();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

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
      activeTab={activeTab}
      showForm={showForm}
      setShowForm={setShowForm}
    />
  );

  return (
    <DataListLayout
      isLoading={loading}
      error={error}
      isEmpty={products.length === 0}
      emptyMessage={searchQuery ? "검색 결과가 없습니다." : isMyProducts ? "등록한 상품이 없습니다." : "등록된 상품이 없습니다."}
      filters={filters}
    >
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