import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { useProducts, LOCATIONS } from "@/features/product/hooks/useProducts";
// import "@/styles/base-layout.css";
// import "@/styles/product-list.css";

function ProductList() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { products, loading, error } = useProducts(selectedLocation);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const locationLabel = LOCATIONS.find(loc => loc.value === selectedLocation)?.label;

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">중고거래 매물</h1>
      
      <LocationSelector 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      {selectedLocation !== 'all' && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg text-sm text-primary font-bold">
          {locationLabel} 매물 {products.length}개
        </div>
      )}
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-6 gap-y-8 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <EmptyState 
           message={selectedLocation !== 'all' 
            ? `${locationLabel}에 등록된 상품이 없습니다.`
            : '등록된 상품이 없습니다.'
           }
        />
      )}
    </div>
  );
}

export default ProductList;
