import { useParams } from 'react-router-dom';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader, DetailSection } from '@/shared/ui';
import { AuctionDetailProvider, useAuctionDetail } from '@/features/auction/hooks/AuctionDetailContext';
import { SellerSection } from '@/features/product/components/detail/SellerSection';
import { ProductDetailView } from '@/features/product/components/detail/ProductDetailView';
import { ProductEditForm } from '@/features/product/components/detail/ProductEditForm';
import { SellerProductList } from '@/features/product/components/detail/SellerProductList';
import { AuctionInfoSection } from '@/features/auction/components/detail/AuctionInfoSection';

function AuctionDetailContent() {
  const { isEditing } = useAuctionDetail();

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="mb-4">
        <SellerSection />
      </DetailSection>

      <DetailSection className="mb-4">
        {isEditing ? <ProductEditForm /> : <ProductDetailView />}
      </DetailSection>

      {/* Auction-specific: bidding info section */}
      <DetailSection>
        <AuctionInfoSection />
      </DetailSection>

      <SellerProductList />
    </PageContainer>
  );
}

export default function AuctionDetail() {
  const { id } = useParams();

  return (
    <AuctionDetailProvider id={id!}>
      <AuctionDetailContent />
    </AuctionDetailProvider>
  );
}
