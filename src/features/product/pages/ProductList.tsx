import { useState, useRef, useEffect } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts, useMyProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/features/product/hooks/useProducts";
import { useUser } from '@/features/user/hooks/useUser';
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { Button, Input, LoginRequired, OnboardingRequired, TabBar, Card, CardContent } from '@/shared/ui';
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
    <Card className="mb-6 border border-border-base rounded-lg p-3">
      <CardContent>
        <h4 className="text-base font-medium text-text-heading mb-4">새 상품 등록</h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">제목</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="상품 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-bg-box p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:bg-bg-box-hover focus:ring-2 focus:ring-gray-300 resize-none"
              placeholder="상품 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">가격 (원)</label>
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
        </form>
      </CardContent>
    </Card>
  );
};

const EditProductForm = ({ product, onSuccess, onCancel }: { product: Product; onSuccess: () => void; onCancel: () => void }) => {
  const [title, setTitle] = useState(product.title);
  const [content, setContent] = useState(product.content);
  const [price, setPrice] = useState(String(product.price));
  const [isSold, setIsSold] = useState(product.is_sold);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        title: title.trim(),
        content: content.trim(),
        price: Number(price),
        category_id: product.category_id,
        is_sold: isSold,
      });
      alert('상품이 수정되었습니다.');
      onSuccess();
    } catch {
      alert('상품 수정에 실패했습니다.');
    }
  };

  return (
    <Card className="mb-6 border border-border-base rounded-lg p-3">
      <CardContent>
        <h4 className="text-base font-medium text-text-heading mb-4">상품 수정</h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">제목</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="상품 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-bg-box p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:bg-bg-box-hover focus:ring-2 focus:ring-gray-300 resize-none"
              placeholder="상품 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">가격 (원)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="가격을 입력하세요"
              min="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_sold"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="is_sold" className="text-sm text-text-secondary">판매 완료</label>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border-base">
            <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" fullWidth disabled={updateProduct.isPending}>
              {updateProduct.isPending ? '수정 중...' : '수정 완료'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface ProductFiltersProps {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeTab: TabType;
  onRegisterClick?: () => void;
  isFormOpen?: boolean;
}

function ProductFilters({ 
  filterCategory, 
  setFilterCategory, 
  searchQuery, 
  setSearchQuery, 
  activeTab,
  onRegisterClick,
  isFormOpen 
}: ProductFiltersProps) {
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

      {/* 검색창과 버튼을 감싸는 컨테이너 */}
      <div className="flex justify-center items-center mb-6 gap-3 px-4">
        
        {/* 검색창 영역 */}
        <div className="relative" ref={dropdownRef}>
          {/* 검색창 컨테이너 - shared/ui Input 스타일 적용 */}
          <div className="flex items-center bg-bg-box rounded-xl overflow-hidden transition-all focus-within:bg-bg-box-hover focus-within:ring-2 focus-within:ring-gray-300">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-text-body hover:bg-bg-box-hover transition-colors whitespace-nowrap"
            >
              {selectedLabel}
              <span className={`text-[10px] text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <div className="w-px h-4 bg-gray-300" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent min-w-[180px] md:min-w-[260px] text-text-primary placeholder:text-text-placeholder"
            />
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-full bg-bg-box rounded-xl z-50 overflow-hidden shadow-lg">
              <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setFilterCategory(cat.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      filterCategory === cat.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-body hover:bg-bg-box-hover'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 새 상품 등록 버튼 */}
        {onRegisterClick && (
          <Button 
            onClick={onRegisterClick} 
            variant={isFormOpen ? 'secondary' : 'primary'}
            // 수정: CategorySelector와 동일한 스타일 적용 (size="sm", rounded-full)
            size="sm"
            className="rounded-full whitespace-nowrap"
          >
            {isFormOpen ? '취소' : '+ 새 상품 등록'}
          </Button>
        )}
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

function ProductGrid({ products, showActions, onEdit, onDelete }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const deleteProduct = useDeleteProduct();

  const allProductsQuery = useProducts(filterCategory, searchQuery);
  const myProductsQuery = useMyProducts({ enabled: isMyProducts && isLoggedIn && !needsOnboarding });

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }
    try {
      await deleteProduct.mutateAsync({ id: product.id });
      alert('상품이 삭제되었습니다.');
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  };

  // 로그인/온보딩 필요 여부 체크
  const needsLogin = isMyProducts && !isLoggedIn;
  const needsOnboardingCheck = isMyProducts && isLoggedIn && needsOnboarding;

  const filters = (
    <ProductFilters
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeTab={activeTab}
      onRegisterClick={isMyProducts ? () => { setShowForm(!showForm); setEditingProduct(null); } : undefined}
      isFormOpen={showForm}
    />
  );

  return (
    <DataListLayout
      isLoading={!needsLogin && !needsOnboardingCheck && loading}
      error={!needsLogin && !needsOnboardingCheck ? error : null}
      isEmpty={!needsLogin && !needsOnboardingCheck && products.length === 0}
      emptyMessage={searchQuery ? "검색 결과가 없습니다." : isMyProducts ? "등록한 상품이 없습니다." : "등록된 상품이 없습니다."}
      filters={filters}
    >
      {needsLogin ? (
        <LoginRequired message="로그인하고 내 상품을 관리하세요" />
      ) : needsOnboardingCheck ? (
        <OnboardingRequired />
      ) : (
        <>
          {showForm && <ProductForm onSuccess={() => setShowForm(false)} />}
          {editingProduct && (
            <EditProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
          <ProductGrid
            products={products}
            showActions={isMyProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
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