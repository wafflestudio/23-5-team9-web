import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";

// ----------------------------------------------------------------------
// 1. Sub-components (Logic & UI Separation)
// ----------------------------------------------------------------------

/**
 * 검색 바 컴포넌트
 */
const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) => {
  return (
    <div className="flex items-center bg-bg-page border border-border-medium rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 w-[300px] sm:w-[400px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="검색어를 입력해주세요"
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-text-primary placeholder:text-text-placeholder"
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Hooks
// ----------------------------------------------------------------------

/**
 * 상품 데이터 로딩 및 필터링 로직 (지역 기반 조회)
 */
const useProductFilterLogic = (regionId?: string) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 지역 기반 상품 조회
  const { products, loading, error } = useProducts(undefined, searchQuery, regionId);

  return {
    products,
    loading,
    error,
    searchQuery, setSearchQuery
  };
};

// ----------------------------------------------------------------------
// 3. Main Components
// ----------------------------------------------------------------------

function ProductList() {
  // 지역 선택 훅
  const {
    currentRegionId,
    currentRegionName,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  } = useRegionSelection();

  // 데이터 & 필터 훅 (지역 기반)
  const {
    products, loading, error,
    searchQuery, setSearchQuery
  } = useProductFilterLogic(currentRegionId);

  return (
    <PageContainer title="중고거래">
      <div className="mb-6 flex items-center justify-between gap-4">
        <RegionSelector
          regionName={currentRegionName}
          onClick={openModal}
        />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </DataListLayout>
      <RegionSelectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleRegionSelect}
        initialRegionId={currentRegionId}
      />
    </PageContainer>
  );
}

export default ProductList;