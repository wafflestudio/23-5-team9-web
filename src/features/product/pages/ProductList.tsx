import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import { useProducts, LOCATIONS } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";

function ProductList() {
  const [filterLoc, setFilterLoc] = useState<string>('all');
  const { products, loading, error } = useProducts(filterLoc);

  const currentLocLabel = LOCATIONS.find(l => l.value === filterLoc)?.label;

  const Filters = (
    <div className="flex flex-col gap-2 bg-white pb-2">
      <LocationSelector selected={filterLoc} onChange={setFilterLoc} />
      {filterLoc !== 'all' && (
        <span className="inline-block px-3 py-1 bg-orange-100 text-primary rounded-full text-sm font-bold w-fit">
          {currentLocLabel} · {products.length}개
        </span>
      )}
    </div>
  );

  return (
    <PageContainer title="중고거래 매물">
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
    </PageContainer>
  );
}

export default ProductList;
