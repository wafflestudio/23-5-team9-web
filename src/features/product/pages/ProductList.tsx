import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts } from "@/features/product/hooks/useProducts"; // useUserProducts 등 제거
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { Button } from '@/shared/ui'; // 불필요한 import 제거

// ----------------------------------------------------------------------
// 1. Sub-components (Logic & UI Separation)
// ----------------------------------------------------------------------

/**
 * 카테고리 선택 드롭다운 컴포넌트
 */
const CategoryDropdown = ({ 
  currentValue, 
  onSelect 
}: { 
  currentValue: string; 
  onSelect: (value: string) => void; 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLabel = PRODUCT_CATEGORIES.find(c => c.value === currentValue)?.label || '전체';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-text-body hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {selectedLabel}
        <span className={`text-[10px] text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] w-full min-w-[120px] bg-bg-page border border-border-medium rounded-xl z-50 overflow-hidden shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelect(cat.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  currentValue === cat.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-body hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 필터 바 (검색, 카테고리, 내 프로필 이동 버튼)
 */
const ProductFilterBar = ({
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
}: {
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-bg-page">
      {/* 탭바 제거됨 */}

      <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-3 px-4 pt-4">
        <div className="relative w-full md:w-auto flex-1 max-w-2xl">
          <div className="flex items-center bg-bg-page border border-border-medium rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 w-full">
            
            <CategoryDropdown currentValue={filterCategory} onSelect={setFilterCategory} />

            <div className="w-px h-4 bg-gray-300" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent min-w-[180px] text-text-primary placeholder:text-text-placeholder"
            />
          </div>
        </div>

        {/* 내 프로필 / 상품 관리 버튼 추가 */}
        <Button 
          onClick={() => navigate('/user/me')} 
          variant="outline"
          size="sm"
          className="rounded-xl whitespace-nowrap w-full md:w-auto h-[42px]"
        >
          내 프로필 / 상품 관리
        </Button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Hooks
// ----------------------------------------------------------------------

/**
 * 상품 데이터 로딩 및 필터링 로직 (전체 상품만 조회)
 */
const useProductFilterLogic = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 전체 상품 조회 (서버 사이드 필터링)
  const { products, loading, error } = useProducts(filterCategory, searchQuery);
  
  return {
    products,
    loading,
    error,
    filterCategory, setFilterCategory,
    searchQuery, setSearchQuery
  };
};

// ----------------------------------------------------------------------
// 3. Main Components
// ----------------------------------------------------------------------

function ProductList() {
  // 데이터 & 필터 훅 (단순화됨)
  const { 
    products, loading, error, 
    filterCategory, setFilterCategory, 
    searchQuery, setSearchQuery 
  } = useProductFilterLogic();

  return (
    <PageContainer title="중고거래">
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
        filters={
          <ProductFilterBar
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              // showActions, onEdit, onDelete 제거 (관리 기능은 프로필 페이지로 위임)
            />
          ))}
        </div>
      </DataListLayout>
    </PageContainer>
  );
}

export default ProductList;