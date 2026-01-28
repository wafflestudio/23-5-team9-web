import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAuctionDetailLogic } from './useAuctionDetailLogic';
import { Loading, ErrorMessage, EmptyState } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { DetailProvider, type DetailContextValue } from '@/features/product/hooks/DetailContext';

type AuctionDetailContextType = ReturnType<typeof useAuctionDetailLogic>;

const AuctionDetailContext = createContext<AuctionDetailContextType | null>(null);

interface AuctionDetailProviderProps {
  auctionId: string;
  children: ReactNode;
}

export function AuctionDetailProvider({ auctionId, children }: AuctionDetailProviderProps) {
  const t = useTranslation();
  const logic = useAuctionDetailLogic(auctionId);

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

  if (logic.auctionLoading) return <Loading />;
  if (logic.auctionError) return <ErrorMessage message={t.auction.notFound} />;
  if (!logic.auction || !detailValue) return <EmptyState message={t.auction.notFound} />;

  return (
    <AuctionDetailContext.Provider value={logic}>
      <DetailProvider value={detailValue}>
        {children}
      </DetailProvider>
    </AuctionDetailContext.Provider>
  );
}

export function useAuctionDetail() {
  const context = useContext(AuctionDetailContext);
  if (!context) {
    throw new Error('useAuctionDetail must be used within AuctionDetailProvider');
  }
  return context;
}
