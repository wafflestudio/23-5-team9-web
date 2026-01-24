import ProductCard from "@/features/product/components/ProductCard";
import SearchBar from "@/features/product/components/SearchBar";
import { useProductFilterLogic } from "@/features/product/hooks/useProductFilterLogic";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";

export default function ProductList() {
  const {
    currentRegionId,
    currentRegionName,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  } = useRegionSelection();

  const {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
  } = useProductFilterLogic(currentRegionId);

  return (
    <PageContainer title="중고거래">
      <div className="mb-6 flex items-center justify-between gap-4">
        <RegionSelector regionName={currentRegionName} onClick={openModal} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
