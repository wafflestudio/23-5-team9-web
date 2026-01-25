import { useTranslation } from '@/shared/i18n';
import { useProductDetail } from '@/features/product/hooks/ProductDetailContext';
import ProductCard from '@/features/product/components/list/ProductCard';

export function SellerProductList() {
  const t = useTranslation();
  const { product, sellerProducts, sellerProfile } = useProductDetail();

  if (!sellerProducts) return null;

  const filteredProducts = sellerProducts
    .filter(p => p.owner_id === product?.owner_id && p.id !== product?.id)
    .slice(0, 4);

  if (filteredProducts.length === 0) return null;

  const nickname = sellerProfile?.nickname || t.product.seller;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">
        {nickname}{t.product.salesItems}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
