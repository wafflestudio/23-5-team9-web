import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useProductDetailLogic } from '../hooks/useProductDetailLogic';
import { Loading, ErrorMessage, EmptyState } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { DetailProvider, type DetailContextValue } from '@/features/product/hooks/DetailContext';

type ProductDetailContextType = ReturnType<typeof useProductDetailLogic>;

const ProductDetailContext = createContext<ProductDetailContextType | null>(null);

interface ProductDetailProviderProps {
  productId: string;
  children: ReactNode;
}

export function ProductDetailProvider({ productId, children }: ProductDetailProviderProps) {
  const t = useTranslation();
  const logic = useProductDetailLogic(productId);

  // Memoize shared detail context value to prevent unnecessary re-renders
  const detailValue = useMemo<DetailContextValue | null>(() => {
    if (!logic.product) return null;
    return {
      product: logic.product,
      sellerProfile: logic.sellerProfile,
      sellerProducts: logic.sellerProducts,
      isLiked: logic.isLiked,
      isOwner: logic.isOwner ?? false,
      isEditing: logic.isEditing,
      isDeleting: logic.isDeleting,
      isUpdating: logic.isUpdating,
      isChatLoading: logic.isChatLoading,
      handleLike: logic.handleLike,
      handleChat: logic.handleChat,
      handleDelete: logic.handleDelete,
      handleEdit: logic.handleEdit,
      handleNavigateToSeller: logic.handleNavigateToSeller,
      startEditing: logic.startEditing,
      cancelEditing: logic.cancelEditing,
    };
  }, [logic]);

  if (logic.productLoading) return <Loading />;
  if (logic.productError) return <ErrorMessage message={t.product.loadFailed} />;
  if (!logic.product || !detailValue) return <EmptyState message={t.product.noInfo} />;

  return (
    <ProductDetailContext.Provider value={logic}>
      <DetailProvider value={detailValue}>
        {children}
      </DetailProvider>
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
