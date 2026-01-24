import { useParams } from "react-router-dom";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, DetailSection, Avatar } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";
import { ProductDetailView } from "@/features/product/components/ProductDetailView";
import { ProductEditForm } from "@/features/product/components/ProductEditForm";
import { useProductDetailLogic } from "@/features/product/hooks/useProductDetailLogic";

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------

const SellerProfileCard = ({ profile, onClick }: { profile: any; onClick?: () => void }) => (
  <div
    className={`flex items-center gap-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    onClick={onClick}
  >
    <Avatar src={profile?.profile_image} alt={profile?.nickname} size="sm" />
    <div>
      <div className="font-semibold text-text-heading">{profile?.nickname || '알 수 없음'}</div>
      <div className="text-sm text-text-secondary">판매자</div>
    </div>
  </div>
);

const SellerSection = ({
  profile,
  onProfileClick,
  onChatClick,
  chatLoading,
  showChatButton
}: {
  profile: any,
  onProfileClick: () => void,
  onChatClick: () => void,
  chatLoading: boolean,
  showChatButton: boolean
}) => (
  <div className="flex items-center justify-between">
    <SellerProfileCard profile={profile} onClick={onProfileClick} />
    {showChatButton && (
      <Button size="sm" onClick={onChatClick} disabled={chatLoading}>
        {chatLoading ? '연결 중...' : '채팅하기'}
      </Button>
    )}
  </div>
);

const SellerProductList = ({ products, currentOwnerId, nickname }: { products: any[], currentOwnerId: string, nickname?: string }) => {
  const sellerProducts = products.filter(p => p.owner_id === currentOwnerId).slice(0, 4);

  if (sellerProducts.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{nickname || '판매자'}의 판매 물품</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------

function ProductDetail() {
  const { id } = useParams();
  const {
    // Data
    product,
    sellerProfile,
    sellerProducts,
    // Loading/Error States
    productLoading,
    productError,
    isDeleting,
    isUpdating,
    isChatLoading,
    // UI State
    isLiked,
    isEditing,
    isOwner,
    // Handlers
    handleLike,
    handleChat,
    handleDelete,
    handleEdit,
    handleNavigateToSeller,
    startEditing,
    cancelEditing,
  } = useProductDetailLogic(id!);

  if (productLoading) return <Loading />;
  if (productError) return <ErrorMessage message="상품 정보를 불러올 수 없습니다." />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="mb-4">
        <SellerSection
          profile={sellerProfile}
          onProfileClick={handleNavigateToSeller}
          onChatClick={handleChat}
          chatLoading={isChatLoading}
          showChatButton={!isOwner}
        />
      </DetailSection>

      <DetailSection>
        {isEditing ? (
          <ProductEditForm
            product={product}
            isUpdating={isUpdating}
            onSubmit={handleEdit}
            onCancel={cancelEditing}
          />
        ) : (
          <ProductDetailView
            product={product}
            isLiked={isLiked}
            isOwner={!!isOwner}
            isDeleting={isDeleting}
            onLike={handleLike}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        )}
      </DetailSection>

      {sellerProducts && (
        <SellerProductList
          products={sellerProducts}
          currentOwnerId={product.owner_id}
          nickname={sellerProfile?.nickname || ''}
        />
      )}
    </PageContainer>
  );
}

export default ProductDetail;
