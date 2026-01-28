import { createContext, useContext, type ReactNode } from 'react';
import type { ProductResponse, PublicUserResponse, AuctionProduct } from '@/shared/api/types';
import type { ProductFormData } from '@/features/product/hooks/schemas';

/**
 * Shared context for product/auction detail pages.
 * Both ProductDetailProvider and AuctionDetailProvider populate this context,
 * allowing shared components (SellerSection, ProductDetailView, ProductEditForm, SellerProductList)
 * to work with either.
 */

export type DetailProduct = ProductResponse | AuctionProduct;

export interface DetailContextValue {
  // Core product data (shared between product and auction)
  product: DetailProduct;
  sellerProfile: PublicUserResponse | null | undefined;
  sellerProducts: ProductResponse[] | undefined;

  // UI State
  isLiked: boolean;
  isOwner: boolean;
  isEditing: boolean;

  // Loading States
  isDeleting: boolean;
  isUpdating: boolean;
  isChatLoading: boolean;

  // Handlers
  handleLike: () => void;
  handleChat: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleEdit: (data: ProductFormData) => Promise<void>;
  handleNavigateToSeller: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
}

const DetailContext = createContext<DetailContextValue | null>(null);

interface DetailProviderProps {
  value: DetailContextValue;
  children: ReactNode;
}

export function DetailProvider({ value, children }: DetailProviderProps) {
  return (
    <DetailContext.Provider value={value}>
      {children}
    </DetailContext.Provider>
  );
}

export function useDetail(): DetailContextValue {
  const context = useContext(DetailContext);
  if (!context) {
    throw new Error('useDetail must be used within DetailProvider');
  }
  return context;
}
