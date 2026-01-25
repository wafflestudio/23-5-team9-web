import { createContext, useContext, type ReactNode } from 'react';
import { useProductDetailLogic } from '../hooks/useProductDetailLogic';
import { Loading, ErrorMessage, EmptyState } from '@/shared/components';
import { useTranslation } from '@/shared/i18n';

type ProductDetailContextType = ReturnType<typeof useProductDetailLogic>;

const ProductDetailContext = createContext<ProductDetailContextType | null>(null);

interface ProductDetailProviderProps {
  productId: string;
  children: ReactNode;
}

export function ProductDetailProvider({ productId, children }: ProductDetailProviderProps) {
  const t = useTranslation();
  const logic = useProductDetailLogic(productId);

  if (logic.productLoading) return <Loading />;
  if (logic.productError) return <ErrorMessage message={t.product.loadFailed} />;
  if (!logic.product) return <EmptyState message={t.product.noInfo} />;

  return (
    <ProductDetailContext.Provider value={logic}>
      {children}
    </ProductDetailContext.Provider>
  );
}

export function useProductDetail() {
  const context = useContext(ProductDetailContext);
  if (!context) {
    throw new Error('useProductDetail must be used within ProductDetailProvider');
  }
  return context;
}
