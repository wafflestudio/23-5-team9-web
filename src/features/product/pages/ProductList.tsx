import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { useProducts, LOCATIONS } from "@/features/product/hooks/useProducts";
import "@/styles/common.css";
import "@/styles/base-layout.css";
import "@/styles/product-list.css";

function ProductList() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { products, loading, error } = useProducts(selectedLocation);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const locationLabel = LOCATIONS.find(loc => loc.value === selectedLocation)?.label;

  return (
    <div className="post-list-container">
      <h1 className="product-list-title">중고거래 매물</h1>
      
      <LocationSelector 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      {selectedLocation !== 'all' && (
        <div className="location-filter-info">
          {locationLabel} 매물 {products.length}개
        </div>
      )}
      
      <div className="post-list-grid">
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
