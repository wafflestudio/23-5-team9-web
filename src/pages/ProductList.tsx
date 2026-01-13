import { useState } from 'react';
import "../styles/common.css";
import "../styles/base-layout.css";
import "../styles/product-list.css";
import ProductCard from "../components/ProductCard";
import LocationSelector from "../components/LocationSelector";
import { useProducts, LOCATIONS } from "../hooks/useProducts";

function ProductList() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { products, loading, error } = useProducts(selectedLocation);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list-container">
      <h1 className="product-list-title">중고거래 매물</h1>
      
      <LocationSelector 
        selectedLocation={selectedLocation}

        onLocationChange={setSelectedLocation}
      />
      
      {selectedLocation !== 'all' && (
        <div className="location-filter-info">
          {LOCATIONS.find(loc => loc.value === selectedLocation)?.label} 매물 {products.length}개
        </div>
      )}
      
      <div className="post-list-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="no-results">
          {selectedLocation !== 'all' 
            ? `${LOCATIONS.find(loc => loc.value === selectedLocation)?.label}에 등록된 상품이 없습니다.`
            : '등록된 상품이 없습니다.'
          }
        </div>
      )}
    </div>
  );
}

export default ProductList;
