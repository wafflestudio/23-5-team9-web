import { useState } from "react";
import ProductCard from "@/features/product/components/list/ProductCard";
import SearchBar from "@/features/product/components/list/SearchBar";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";
import { useTranslation } from "@/shared/i18n";

export default function ProductList() {
  const t = useTranslation();
  const {
    currentRegionId,
    currentRegionName,
    currentSido,
    currentSigugun,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
    handleSidoSelect,
    handleSigugunSelect,
    handleClearRegion,
  } = useRegionSelection();

  const [searchQuery, setSearchQuery] = useState("");
  // 지역 필터: 동 단위, 시/구/군 단위, 시/도 단위 모두 지원
  const { products, loading, error } = useProducts({ 
    search: searchQuery, 
    regionId: currentRegionId,
    sido: currentSido,
    sigugun: currentSigugun,
  });

  return (
    <PageContainer title={t.product.usedGoods}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <RegionSelector regionName={currentRegionName} onClick={openModal} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? t.product.noSearchResults : t.product.noProducts}
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
        onSelectSido={handleSidoSelect}
        onSelectSigugun={handleSigugunSelect}
        onClearRegion={handleClearRegion}
        initialRegionId={currentRegionId}
      />
    </PageContainer>
  );
}
