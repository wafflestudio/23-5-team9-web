import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import { useProducts, LOCATIONS } from "@/features/product/hooks/useProducts";
import { Loading } from "@/shared/ui/StatusMessage";

function ProductList() {
  const [filterLoc, setFilterLoc] = useState<string>('all');
  const { products, loading, error } = useProducts(filterLoc);

  // 1. 조기 리턴 패턴으로 들여쓰기 깊이 최소화
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-10 text-center">{error}</div>;

  // 2. 파생 데이터 계산 (UI 로직 분리)
  const currentLocLabel = LOCATIONS.find(l => l.value === filterLoc)?.label;
  const isEmpty = products.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">중고거래 매물</h1>
        <LocationSelector selected={filterLoc} onChange={setFilterLoc} />
        
        {/* 조건부 렌더링을 깔끔하게: 값이 있을 때만 뱃지 표시 */}
        {filterLoc !== 'all' && (
          <span className="inline-block px-3 py-1 bg-orange-100 text-primary rounded-full text-sm font-bold">
            {currentLocLabel} · {products.length}개
          </span>
        )}
      </header>
      
      {/* 3. 리스트 렌더링 영역 */}
      {isEmpty ? (
        <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-2xl">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
