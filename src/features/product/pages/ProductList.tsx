import { useState } from "react";
import ProductCard from "@/features/product/components/ProductCard";
import SearchBar from "@/features/product/components/SearchBar";
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
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  } = useRegionSelection();

  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading, error } = useProducts(undefined, searchQuery, currentRegionId);

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
        initialRegionId={currentRegionId}
      />
    </PageContainer>
  );
}
