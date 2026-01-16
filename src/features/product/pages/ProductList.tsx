import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/shared/constants/data";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import Badge from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";

function ProductList() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { products, loading, error } = useProducts(filterCategory);

  const Filters = (
    <div className="flex flex-col gap-3 bg-bg-page pb-2">
      {/* 스크롤 가능한 카테고리 필터 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {PRODUCT_CATEGORIES.map(category => (
            <Button
              key={category.value}
              variant={filterCategory === category.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilterCategory(category.value)}
              className="whitespace-nowrap rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {filterCategory !== 'all' && (
        <Badge variant="primary" className="text-sm w-fit px-3 py-1">
          {PRODUCT_CATEGORIES.find(c => c.value === filterCategory)?.label}
          {' · '}{products.length}개
        </Badge>
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
